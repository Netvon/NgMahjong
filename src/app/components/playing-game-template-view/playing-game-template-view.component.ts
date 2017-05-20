import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core'

import { TemplateTile } from '../../models'
import { GameService } from '../../service/game.service'
import {GameTemplateViewComponent} from "../game-template-view/game-template-view.component";


@Component({
    selector: 'app-playing-game-template-view',
    templateUrl: '../game-template-view/game-template-view.component.html',
    styleUrls: ['../game-template-view/game-template-view.component.scss']
})
export class PlayingGameTemplateViewComponent extends GameTemplateViewComponent {


    private selectedTile;


    constructor(gameService: GameService) {
        super(gameService)

    }

    selectTile(selectedTile: TemplateTile){

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

    tileSelected(tile: TemplateTile){
        return (this.selectedTile != null && this.selectedTile._id == tile._id)
    }



    tileSelectable(selectableTile: TemplateTile){

        var tileLeft = false
        var tileRight = false

        for (let tile of this.gameTemplate.tiles) {
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

    allowedShowingPlayingInfo(){
        return true;
    }







}
