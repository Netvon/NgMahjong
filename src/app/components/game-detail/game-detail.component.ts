import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { GameService } from '../../service/game.service'
import { Game, UserInGame, PlayingBoard, TemplateBoard, GameState } from '../../models'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/toArray'
import { Observable } from 'rxjs/Observable'
import { AuthService } from '../../service'

@Component({
	selector: 'app-game-detail',
	templateUrl: './game-detail.component.html',
	styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {

	game: Observable<Game>
	users: Observable<UserInGame[]>
	selectedTemplate: TemplateBoard = null
	canStartGame = false
	isPlayer = false

	constructor(
		private gameService: GameService,
		private route: ActivatedRoute,
		private title: Title,
		private authService: AuthService
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


		this.users.subscribe(users => {
			this.isPlayer = users.some(x => x._id === this.authService.username)
			// for (let x = 0; x < users.length; x++) {
			// 	if (users[x]._id === this.authService.username) {
			// 		this.isPlayer = true
			// 		return
			// 	}
			// }
		})

		this.game.subscribe(results => {
			this.title.setTitle(`${results.gameTemplate.id} by ${results.createdBy.name} - Mahjong`)

			this.canStartGame = !((results.createdBy._id === this.authService.username ||
								results.players.some(p => p._id === this.authService.username)) &&
								!results.hasPlaceLeft)

			console.log(this.canStartGame)

			if (results.state.toString() === 'open') {
				this.gameService.getTemplates().subscribe(x => {

					this.selectedTemplate = x[x.map(e => e.id).indexOf(results.gameTemplate.id)]
				})
			}
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
					location.reload()
				},
			error => target.classList.remove('is-loading'))
	}

}
