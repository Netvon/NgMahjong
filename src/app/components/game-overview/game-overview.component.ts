import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { Game, Pagination, PaginationDetails, GameState } from '../../models'
import { GameService } from '../../service/game.service'

import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'

@Component({
	selector: 'app-game-overview',
	templateUrl: './game-overview.component.html',
	styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {

	isLoading = true

	games: Observable<Pagination<Game>>
	overviewState: GameState
	pagination: PaginationDetails

	private pageParam: number
	private perPageParam: number

	constructor(
		private gameService: GameService,
		private route: ActivatedRoute,
		private router: Router,
		private title: Title
	) { }

	ngOnInit() {
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return
			}

			window.scrollTo(0, 0)
		})

		this.games = this.route.params
			.switchMap((params: Params) => {
				this.isLoading = true
				this.pageParam = (+params['page'] - 1) || 0
				this.perPageParam = +params['perPage'] || 10
				this.overviewState = +GameState[params['state']] || GameState.open

				if (this.pageParam < 0) {
					this.router.navigate(['/games', 1])
				}

				return this.gameService.getGames(this.perPageParam, this.pageParam, this.overviewState)
			})

		this.games.subscribe(x => {
			this.pagination = x as PaginationDetails

			if (this.pageParam > this.pagination.pages) {
				this.router.navigate(['/games', this.pagination.pages])
			}

			this.title.setTitle(`Game Overview - Page ${this.pagination.page} - Mahjong`)

			this.isLoading = false
		}, error => {
			console.log(error)
		})
	}

	joinClicked(event: MouseEvent, game: Game) {

		const target = event.currentTarget as HTMLAnchorElement
		target.classList.add('is-loading')

		this.gameService.getToken()
						.switchMap(token => {
							return this.gameService.joinGame(game, token)
						})
						.subscribe(x => {
							target.classList.remove('is-loading')
							console.log(x)
						}, error => target.classList.remove('is-loading'))
	}

}
