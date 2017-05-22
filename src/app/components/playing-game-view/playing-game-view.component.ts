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

    private spriteSheet: SpriteSheet
    private selectedTile;


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
        })
    }


    get zGroupedTiles(): Array<TileViewModel[]> {

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

            return values(grouped)
        }

        return [[]]
    }



    selectTile(selectedTile: PlayingTile){

        if(this.tileSelectable(selectedTile)){

            if(this.tileSelected(selectedTile)){
                this.selectedTile = null;
            }
            else if(this.selectedTile){

                // SEND MATCH TO THE SERVER, AND DO THE FOLLOWING WHEN SUCCEEDED

                if(this.gameId){
                    this.gameService.getToken()
                        .switchMap(token => {

                            return this.gameService.postMatch(this.gameId, selectedTile._id, this.selectedTile._id , token)
                        })
                        .subscribe(x => {
                            console.log(x)
                            this.getGameBoard()


                            this.gameBoard.tiles.splice(this.gameBoard.tiles.indexOf(selectedTile));
                            this.gameBoard.tiles.splice(this.gameBoard.tiles.indexOf(this.selectedTile));


                            this.selectedTile = null;
                        })


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







}
