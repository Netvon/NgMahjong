import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core'

import { GameService } from '../../service/game.service'
import {TemplateTileViewModel} from "../game-template-view/template-tile.vm";
import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import {TileViewModel} from "./tile.vm";
import {PlayingBoard} from "../../models/board/playing-board.model";
import {PlayingTile} from "../../models/tile/playing-tile.model";

@Component({
    selector: 'app-playing-game-view',
    templateUrl: './playing-game-view.component.html',
    styleUrls: ['./playing-game-view.component.scss']
})
export class PlayingGameViewComponent {

    @Input() gameBoard: PlayingBoard
    @Input() tileSize = 1
    @Input() tileXSize = 1.9
    @Input() tileYSize = 1.9
    @Input() tileZOffsetX = 0
    @Input() tileZOffsetY = 0
    @Input() tileRadius = .25
    @Input() tileClass = ['template-tile']
    @Input() containerClass = ['template-view']
    @Input() tileStroke = 'black'
    @Input() tileStrokeWidth = 0.1



    private selectedTile;

    constructor(gameService: GameService) {

    }

    get viewBox(): string {
        if ( this.gameBoard ) {
            return `0 0 ${this.gameBoard.width} ${this.gameBoard.height}`
        }

        return '0 0 0 0'
    }


    get zGroupedTiles(): Array<TileViewModel[]> {
        if ( this.gameBoard ) {
            const mapped = this.gameBoard.tiles.map(a => {
                return new TileViewModel().fromTemplateTile(a, this.calculateX(a), this.calculateY(a))
            })

            const grouped = groupBy(mapped, b => b.zPos)

            return values(grouped)
        }

        return [[]]
    }

    calculateX(tile: PlayingTile) {
        return this.calculate(tile, tile.xPos)
    }

    calculateY(tile: PlayingTile) {
        // return ((tile.yPos - .5) + ((tile.zPos - 1) / 2)) / 2
        return this.calculate(tile, tile.yPos)
    }

    protected calculate(tile: PlayingTile, pos: number) {
        return pos - this.tileSize
        // return ((pos - this.tileSizeAdjusted) + ((tile.zPos - this.tileSize) / this.tileScale)) / this.tileScale
    }


    selectTile(selectedTile: PlayingTile){

        if(this.tileSelectable(selectedTile)){
            if(this.selectedTile != null){

                // SEND MATCH TO THE SERVER, AND DO THE FOLLOWING WHEN SUCCEEDED

                this.selectedTile = null;

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
