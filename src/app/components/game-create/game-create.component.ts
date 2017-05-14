import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { GameService } from '../../service/game.service'
import { GameTemplate, PostGame } from '../../models'

import { Observable } from 'rxjs/Observable'

@Component({
	selector: 'app-game-create',
	templateUrl: './game-create.component.html',
	styleUrls: ['./game-create.component.scss']
})
export class GameCreateComponent implements OnInit {

	gameTemplates: Observable<GameTemplate[]>
	selectedTemplate: GameTemplate = null;
	minPlayers: number
	maxPlayers: number

	constructor(
		private gameService: GameService,
		private router: Router,
		private title: Title
	) { }

	ngOnInit() {
		this.title.setTitle('Create Game - Mahjong')
		this.gameTemplates = this.gameService.getTemplates()
		this.gameTemplates.subscribe(x => {

			// Door dit uit te schakelen wordt ngModel van de select niet verward en selecteerd het gewoon de default.

			// this.selectedTemplate = x[0]
		})
	}

	createGame(event) {
		const target = event.currentTarget as HTMLAnchorElement
		target.classList.add('is-loading')

		this.gameService.getToken()
			.switchMap(token => {
				const newGame = new PostGame()
				newGame.maxPlayers = this.maxPlayers
				newGame.minPlayers = this.minPlayers
				newGame.templateName = this.selectedTemplate.id

				return this.gameService.createGame(newGame, token)
			})
			.subscribe(x => {
				this.router.navigate(['/games', 1])
			})
	}

}
