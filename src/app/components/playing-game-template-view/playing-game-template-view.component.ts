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

    constructor(gameService: GameService) {
        super(gameService)

    }


    tileSelectable(tile: TemplateTile){

        return true
    }

    allowedShowingPlayingInfo(){
        return true;
    }


}
