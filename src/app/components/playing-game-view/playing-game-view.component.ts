import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core'

import { GameService } from '../../service/game.service'
import {TemplateTileViewModel} from "../game-template-view/template-tile.vm";
import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import {TileViewModel} from "./tile.vm";
import {PlayingBoard} from "../../models/board/playing-board.model";
import {PlayingTile} from "../../models/tile/playing-tile.model";
import {SpriteSheet} from "../../models/tile/sprite-sheet.model";
import {ActivatedRoute, Params} from '@angular/router'
import { Observable } from 'rxjs/Observable'
import {PostMatch} from "../../models/tile/post-match.model";



@Component({
    selector: 'app-playing-game-view',
    templateUrl: './playing-game-view.component.html',
    styleUrls: ['./playing-game-view.component.scss']
})
export class PlayingGameViewComponent implements OnInit{


    @Input() gameId: string
    @Input() tileZOffsetX = 0.15
    @Input() tileZOffsetY = -0.15
    @Input() containerClass = ['template-view']
    @Input() tileClass = ['template-tile']

    board: Observable<PlayingBoard>
    gameBoard: PlayingBoard
    groupedBoard: Array<TileViewModel[]>

    private spriteSheet: SpriteSheet
    private selectedTile
    private hintTiles: TileViewModel[] = []
    private sendMatchQueue = []


    constructor(private gameService: GameService, private route: ActivatedRoute) {
        this.spriteSheet = new SpriteSheet("../../../assets/Tiles-1", 349, 480)
    }

    get viewBox(): string {
        if ( this.gameBoard ) {
            return `0 0 ${this.spriteSheet.calculateTotalWidth(this.gameBoard.width)} ${this.spriteSheet.calculateTotalHeight(this.gameBoard.height)}`
        }

        return '0 0 0 0'
    }

    ngOnInit() {

        this.getGameBoard()

    }

    getGameBoard(){
        this.board = this.gameService.getPlayingBoard(this.gameId)
        this.board.subscribe(results => {
            this.gameBoard = results
            this.loadGroupedBoard()
        })
    }


    loadGroupedBoard(): Array<TileViewModel[]> {

        if ( this.gameBoard ) {
            var mapped = this.gameBoard.tiles.map(a => {
                return new TileViewModel(a, this.spriteSheet.getTileSprite(a.tile), this.spriteSheet.calculateX(a), this.spriteSheet.calculateY(a), this.spriteSheet.spriteWidth, this.spriteSheet.spriteHeight)
            })



            let result = this.orderTilesByShadow(mapped)

            this.groupedBoard = values(result)
            return values(result)
        }

        return [[]]
    }




    orderTilesByShadow(tiles: TileViewModel[]): Array<TileViewModel[]>{
        // Lets start with some variables
        var dict = {};
        var maxZ = 0;
        var maxX = 0;
        var maxY = 0;
        var result = [];

        // Make a dictionary of tiles, so it is easier to get a tile at a certain position
        // Also get the maximum z, x and y value
        for (let tile of tiles) {
            if(!dict[tile.zPos]){
                dict[tile.zPos] = {};
            }
            if(!dict[tile.zPos][tile.xPos]){
                dict[tile.zPos][tile.xPos] = {};
            }
            dict[tile.zPos][tile.xPos][tile.yPos] = tile;
            if(tile.zPos > maxZ){
                maxZ = tile.zPos
            }
            if(tile.xPos > maxX){
                maxX = tile.xPos
            }
            if(tile.yPos > maxY){
                maxY = tile.yPos
            }
        }

        // Here is where the fun(ordering) begins
        for (var z = 0; z <= maxZ ; z++) {

            // Make sure each z index has a separate array
            result.push([])

            // Loop through all possible positions where a tile might be, in order from each y value
            for (var y = 0; y <= maxY; y++) {
                for (var x = maxX; x >= 0; x--) {

                    // Check if there is a tile on this position
                    if(dict[z] && dict[z][x] && dict[z][x][y]){

                        // Check if there are tiles nearby which get a higher priority
                        this.checkForTilePriority(dict, z, x, y, maxX, result)

                        // Add the tile to the final result array
                        result[z].push(dict[z][x][y])

                    }

                }
            }
        }

        return result
    }


    checkForTilePriority(dict, z, x, y, maxX, result) {

        // Check if there is a stupid tile nearby which gets a higher priority
        if(dict[z] && dict[z][x+2] && dict[z][x+2][y+1]){

            // If there is, (only) the tiles which are next to it also get a higher priority
            // So loop through and get a number how many tiles are next to each other
            var tilesRight = x+2;
            for (tilesRight; tilesRight <= maxX; tilesRight = tilesRight+2){
                if(!(dict[z] && dict[z][tilesRight] && dict[z][tilesRight][y+1])){
                    break;
                }
            }

            // Now loop through all those tiles
            for (var xx = tilesRight; xx >= x+2; xx = xx-2) {
                if(dict[z] && dict[z][xx] && dict[z][xx][y+1]){
                    // Also those tiles could have tiles nearby that have a higher priority, so check that too with this function
                    this.checkForTilePriority(dict, z, xx, y+1, maxX, result)

                    // Hurray, finally add the tiles to the final result array
                    result[z].push(dict[z][xx][y+1])

                    // And delete it from the total array, so it doesn't get added twice
                    delete dict[z][xx][y+1]
                }
            }

        }


    }


    addMatchToQueue(postMatch: PostMatch){

        if(this.sendMatchQueue.length == 0){
            this.sendMatchQueue.push(postMatch)
            this.executeMatchQueue()
        }
        else{
            this.sendMatchQueue.push(postMatch)
        }

    }

    private executeMatchQueue(){
        if(this.sendMatchQueue.length != 0){
            this.gameService.getToken()
                .switchMap(token => {
                    console.log("Send match")
                    return this.gameService.postMatch(this.sendMatchQueue[0], token)
                })
                .subscribe(x =>{
                    console.log("Recieve match")
                    this.sendMatchQueue.splice(0,1)
                    this.executeMatchQueue()
                })
        }

    }



    selectTile(selectedTile: PlayingTile){

        if(this.tileSelectable(selectedTile)){

            if(this.tileSelected(selectedTile)){
                this.selectedTile = null;
            }
            else if(this.selectedTile){

                if(this.gameId){

                    if(this.tilesMatchable(selectedTile, this.selectedTile)){

                        this.gameBoard.tiles.splice(this.gameBoard.tiles.map(function(e) { return e._id; }).indexOf(selectedTile._id), 1);
                        this.gameBoard.tiles.splice(this.gameBoard.tiles.map(function(e) { return e._id; }).indexOf(this.selectedTile._id), 1);

                        this.loadGroupedBoard()

                        this.addMatchToQueue(new PostMatch(this.gameId, selectedTile._id, this.selectedTile._id))

                        this.selectedTile = null;

                    }
                    else{
                        console.log("These 2 tiles are not matchable...")
                        this.selectedTile = null;
                    }

                }
                else{
                    console.log("The game id has not been passed through to the board...")
                }

            }
            else{
                this.selectedTile = selectedTile;
            }
        }
    }

    tileSelected(tile: PlayingTile){
        return (this.selectedTile != null && this.selectedTile._id == tile._id)
    }


    tilesMatchable(tile1: PlayingTile, tile2: PlayingTile){

        return ((tile1.tile.suit == tile2.tile.suit) && ((tile1.tile.matchesWholeSuit && tile2.tile.matchesWholeSuit) || (tile1.tile.name == tile2.tile.name)))
    }


    tileSelectable(selectableTile: PlayingTile){

        var tileLeft = false
        var tileRight = false

        for (let tile of this.gameBoard.tiles) {
            if(tile._id == selectableTile._id){
                continue
            }

            if(selectableTile.zPos < tile.zPos &&
                (tile.xPos+1 >= selectableTile.xPos && tile.xPos-1 <= selectableTile.xPos) &&
                (tile.yPos+1 >= selectableTile.yPos && tile.yPos-1 <= selectableTile.yPos)){

                return false;
            }

            if(selectableTile.zPos == tile.zPos && (selectableTile.yPos >= tile.yPos-1 && selectableTile.yPos <= tile.yPos+1)){
                if(tile.xPos-2 == selectableTile.xPos){
                    tileLeft = true
                }
                if(tile.xPos+2 == selectableTile.xPos){
                    tileRight = true
                }
                if(tileLeft && tileRight){
                    return false;
                }
            }



        }



        return true
    }


    showHintTiles() {

        var selectableTiles = []
        for (let layer of this.groupedBoard) {
            for (let tile of layer) {
                if (this.tileSelectable(tile)) {
                    selectableTiles.push(tile)
                }
            }
        }

        for (var i = selectableTiles.length - 1; i >= 0; i--) {
            for(var j = 0; j < selectableTiles.length-1; j++){
                if(this.tilesMatchable(selectableTiles[i], selectableTiles[j])){
                    this.hintTiles.splice(0, this.hintTiles.length);
                    this.hintTiles.push(selectableTiles[j])
                    this.hintTiles.push(selectableTiles[i])
                    return
                }
            }
            selectableTiles.splice(i,1)
        }

        console.log("No more tiles are matchable...")

    }

    tileHintable(hintableTile: PlayingTile){
        return (this.hintTiles.map(function(e) { return e._id; }).indexOf(hintableTile._id) != -1)
    }


}
