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

	game: Observable<Game>
	users: Observable<UserInGame[]>

	constructor(
		private gameService: GameService,
		private route: ActivatedRoute,
		private title: Title
	) { }

	ngOnInit() {

		this.users = this.route.params
			.switchMap((params: Params) => {
				return this.gameService.getPlayersInGame(params['id'])
			})

		this.game = this.route.params
			.switchMap((params: Params) => {
				return this.gameService.getGame(params['id'])
			})

		this.game.subscribe(results => {
			this.title.setTitle(`${results.gameTemplate.id} by ${results.createdBy.name} - Mahjong`)
		})
	}

	startGame(event, game: Game) {
		const target = event.currentTarget as HTMLAnchorElement
		target.classList.add('is-loading')

		this.gameService.getToken()
			.switchMap(token => {
				return this.gameService.startGame(game.id, token)
			})
			.subscribe(x => {
				target.classList.remove('is-loading')
			},
			error => target.classList.remove('is-loading'))
	}

}
