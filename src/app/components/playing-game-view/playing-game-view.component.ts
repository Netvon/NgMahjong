import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core'

import { GameService } from '../../service/game.service'
import {TemplateTileViewModel} from "../game-template-view/template-tile.vm";
import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import {TileViewModel} from "./tile.vm";
import {PlayingBoard} from "../../models/board/playing-board.model";
import {PlayingTile} from "../../models/tile/playing-tile.model";
import {SpriteSheet} from "../../models/tile/sprite-sheet.model";

@Component({
    selector: 'app-playing-game-view',
    templateUrl: './playing-game-view.component.html',
    styleUrls: ['./playing-game-view.component.scss']
})
export class PlayingGameViewComponent {

    @Input() gameBoard: PlayingBoard
    @Input() tileZOffsetX = 0.15
    @Input() tileZOffsetY = -0.15
    @Input() containerClass = ['template-view']


    private spriteSheet: SpriteSheet
    private selectedTile;

    constructor(gameService: GameService) {
        this.spriteSheet = new SpriteSheet("../../../assets/Tiles-1", 349, 480)
    }

    get viewBox(): string {
        if ( this.gameBoard ) {
            return `0 0 ${this.spriteSheet.calculateTotalWidth(this.gameBoard.width)} ${this.spriteSheet.calculateTotalHeight(this.gameBoard.height)}`
        }

        return '0 0 0 0'
    }


    get zGroupedTiles(): Array<TileViewModel[]> {

        if ( this.gameBoard ) {
            var mapped = this.gameBoard.tiles.map(a => {
                return new TileViewModel(a, this.spriteSheet.getTileSprite(a.tile), this.spriteSheet.calculateX(a), this.spriteSheet.calculateY(a), this.spriteSheet.spriteWidth, this.spriteSheet.spriteHeight)
            })

            mapped = mapped.sort((a, b) => {
                if (a.xPos < b.xPos) {
                    return 1;
                }
                if (a.xPos > b.xPos) {
                    return -1;
                }

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
