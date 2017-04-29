import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { GameService } from '../../service/game.service'
import { Game, UserInGame } from '../../models'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/toArray'
import { Observable } from 'rxjs/Observable'

@Component({
	selector: 'app-game-detail',
	templateUrl: './game-detail.component.html',
	styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {

	game: Game
	users: UserInGame[]

	constructor(
		private gameService: GameService,
		private route: ActivatedRoute,
		private title: Title
	) { }

	ngOnInit() {

		this.route.params
			.switchMap((params: Params) => {
				return Promise.all([
					this.gameService.getGame(params['id']),
					this.gameService.getPlayersInGame(params['id'])
				])
			})
			.subscribe(results => {
				this.game = results[0]
				this.users = results[1]

				this.title.setTitle(`${this.game.gameTemplate.id} by ${this.game.createdBy.name} - Mahjong`)
			})
	}

}
