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

            mapped = mapped.sort((a, b) => {

                // The order algorithm for drawing the tiles correctly on top of each other
                // (Different shadow sides means different order!)

                // Order the Y's first if the tiles are within half a tile apart
                if(a.yPos > b.yPos+1 || a.yPos < b.yPos-1){
                    if (a.yPos > b.yPos) {
                        return 1;
                    }
                    if (a.yPos < b.yPos) {
                        return -1;
                    }
                }

                // Then order the ones on different X's
                if (a.xPos < b.xPos) {
                    return 1;
                }
                if (a.xPos > b.xPos) {
                    return -1;
                }

                // Then order the ones on different Y's
                if (a.yPos > b.yPos) {
                    return 1;
                }
                if (a.yPos < b.yPos) {
                    return -1;
                }

                return 0;
            })

            const grouped = groupBy(mapped, b => b.zPos)

            this.groupedBoard = values(grouped)
            return values(grouped)
        }

        return [[]]
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
