import { Injectable } from '@angular/core'
import { Http, RequestOptions } from '@angular/http'

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of'
import { Observable } from 'rxjs/Observable'

import { GameTemplate, GameState, Game, Pagination, TokenInfo, UserInGame, ApiResponse, User, PostGame } from '../models'

@Injectable()
export class GameService {

	private baseUrl = 'http://mahjongmayhem.herokuapp.com'

	constructor(private http: Http) { }

	getTemplates(): Observable<GameTemplate[]> {
		return this.http.get(`${this.baseUrl}/gameTemplates`)
						.map(res => res.json().map(x => new GameTemplate().fromJson(x)))
						.catch(this.handleError)
	}

	getTemplate(id: string): Observable<GameTemplate> {
		return this.http.get(`${this.baseUrl}/gameTemplates/${id}`)
						.map(res => new GameTemplate().fromJson(res.json()))
						.catch(this.handleError)
	}

	getGame(id: string): Observable<Game> {
		const url = `${this.baseUrl}/games/${id}`

		return this.http.get(url)
						.map(res => new Game().fromJSON(res.json()))
						.catch(this.handleError)
	}

	getPlayersInGame(id: string): Observable<UserInGame[]> {
		const url = `${this.baseUrl}/games/${id}/players`

		return this.http.get(url)
						.map(res => res.json() as UserInGame[])
						.catch(this.handleError)
	}

	getGames(
		pageSize: number,
		pageIndex: number,
		state?: GameState,
		createdBy?: string,
		player?: string,
		gameTemplate?: string): Observable<Pagination<Game>>  {
			let url = `${this.baseUrl}/games?pageSize=${pageSize}&pageIndex=${pageIndex}`

			if (state != null) {
				url += `&state=${GameState[state]}`
			}

			if (createdBy != null) {
				url += `&createdBy=${createdBy}`
			}

			if (player != null) {
				url += `&player=${player}`
			}

			if (gameTemplate != null) {
				url += `&gameTemplate=${gameTemplate}`
			}

			return this.http.get(url)
						// .toPromise()
						.map(res => {

							const perPage	= +res.headers.get('x-page-size')
							const page		= +res.headers.get('x-page-index')
							const total 	= +res.headers.get('x-total-count')

							const games: Game[] = new Array<Game>()

							for (const game of res.json() as Game[]) {
								const g = new Game()
								g.fromJSON(game)

								games.push(g)
							}

							return new Pagination(games, total, perPage, page)
						})
						.catch(this.handleError)
	}

	joinGame(game: Game, token: TokenInfo): Observable<ApiResponse> {
		const url = `${this.baseUrl}/games/${game.id}/players`

		const options = new RequestOptions({ headers: token.toHeaders() })

		return this.http.post(url, null, options)
						.map(res => {
							const json = res.json()

							game.players.push(new User(token.username, null))

							return {
								message: json.message as string || json as string,
								status: res.status
							}
						})
						.catch(this.handleError)
	}

	startGame(id: string, token: TokenInfo): Observable<ApiResponse> {
		const url = `${this.baseUrl}/games/${id}/start`

		const options = new RequestOptions({ headers: token.toHeaders() })

		return this.http.post(url, null, options)
						.map(res => {
							const json = res.json()

							return {
								message: json.message as string || json as string,
								status: res.status
							}
						})
						.catch(this.handleError)
	}

	createGame(game: PostGame, token: TokenInfo): Observable<ApiResponse> {
		const url = `${this.baseUrl}/games/`
		const auth = token.toHeaders()
		auth.append('Content-Type', 'application/json')

		const options = new RequestOptions({ headers: auth })

		return this.http.post(url, game, options)
						.map(res => {
							const json = res.json()

							return {
								message: json.message as string || json as string,
								status: res.status
							}
						})
						.catch(this.handleError)
	}

	getToken(): Observable<TokenInfo> {

		const info: TokenInfo = new TokenInfo()
		info.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.dUJSESU41icAYhvVnFgvlTrpl4-D2WTTsV3i_1FuZk8'
		info.username = 'tme.vannimwegen@student.avans.nl'

		return Observable.of(info)
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error)

		return Promise.reject(error.message || error)
	}
}
