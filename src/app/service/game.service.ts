import { Injectable } from '@angular/core'
import { Http, RequestOptions } from '@angular/http'

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

import {
	GameState, Game, Pagination, TokenInfo, UserInGame, ApiResponse, User, PostGame, PlayingBoard, TemplateBoard, PostMatch
} from '../models'
import { AuthService } from '../service/auth.service'


@Injectable()
export class GameService {

	private baseUrl = 'http://mahjongmayhem.herokuapp.com'
	private socket


	// private postMatchQueue = []

	constructor(private http: Http, private auth: AuthService) {


	}

	getTemplates(): Observable<TemplateBoard[]> {
		return this.http.get(`${this.baseUrl}/gameTemplates`)
			.map(res => res.json().map(x => new TemplateBoard().fromJson(x)))
			.catch(this.handleError)
	}

	getTemplate(id: string): Observable<TemplateBoard> {
		return this.http.get(`${this.baseUrl}/gameTemplates/${id}`)
			.map(res => new TemplateBoard().fromJson(res.json()))
			.catch(this.handleError)
	}

	getPlayingBoard(id: string): Observable<PlayingBoard> {
		return this.http.get(`${this.baseUrl}/games/${id}/tiles?matched=false`)
			.map(res => new PlayingBoard().fromJson(res.json()))
			.catch(this.handleError)
	}



	testMatchMessages(id: string): Observable<string> {

		return this.http.get(`${this.baseUrl}/test/${id}/PlayerJoined`)
			.map(res => res)
			.catch(this.handleError)

	}


	setupSocketConnection(id: string) {
		this.socket = io(`http://mahjongmayhem.herokuapp.com?gameId=${id}`)
	}


	getMatchMessages(): Observable<PostMatch> {
		return new Observable(s => {

			console.log('getmatchmessages gets called')

			if (this.socket != null) {
				this.socket.on('match', data => {
					console.log('Socket pack recieved: ', data)
					s.next(new PostMatch(null, data[0]._id, data[1]._id))
				})
			}

			return () => {
				this.socket.disconnect()
			}
		})
	}

	getGameStatusMessages(): Observable<string> {
		return new Observable(s => {

			// console.log("getGameStatusMessages gets called")

			if (this.socket != null) {

				console.log('getGameStatusMessages gets called')

				this.socket.on('start', data => {
					console.log('Socket pack recieved: ', data)
					s.next('start')
				})

				this.socket.on('end', data => {
					console.log('Socket pack recieved: ', data)
					s.next('end')
				})
			}

			return () => {
				this.socket.disconnect()
			}
		})
	}

	getUsersJoiningMessages(): Observable<string> {
		return new Observable(s => {

			if (this.socket != null) {

				console.log('getGameStatusMessages gets called')

				this.socket.on('playerJoined', data => {
					console.log('Socket pack recieved: ', data)
					s.next(data)
				})

			}

			return () => {
				this.socket.disconnect()
			}
		})
	}




	postMatch(postMatch: PostMatch, token: TokenInfo): Observable<ApiResponse> {

		const url = `${this.baseUrl}/games/${postMatch.gameId}/tiles/matches`
		const auth = token.toHeaders()
		auth.append('Content-Type', 'application/json')

		const options = new RequestOptions({ headers: auth })

		return this.http.post(url, { 'tile1Id': postMatch.tile1Id, 'tile2Id': postMatch.tile2Id }, options)
			.map(res => {

				const json = res.json()
				return {
					message: json.message as string || json as string,
					status: res.status
				}

			})
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
		gameTemplate?: string): Observable<Pagination<Game>> {
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

				const perPage = +res.headers.get('x-page-size')
				const page = +res.headers.get('x-page-index')
				const total = +res.headers.get('x-total-count')

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

	createGame(game: PostGame, token: TokenInfo): Observable<string> {
		const url = `${this.baseUrl}/games/`
		const auth = token.toHeaders()
		auth.append('Content-Type', 'application/json')

		const options = new RequestOptions({ headers: auth })

		return this.http.post(url, game, options)
			.map(res => {
				const json = res.json()

				return json._id
			})
			.catch(this.handleError)
	}

	getToken(): Observable<TokenInfo> {

		const info: TokenInfo = new TokenInfo()
		info.token = this.auth.token // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.dUJSESU41icAYhvVnFgvlTrpl4-D2WTTsV3i_1FuZk8'
		info.username = this.auth.username // 'tme.vannimwegen@student.avans.nl'

		return Observable.of(info)
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error)

		return Promise.reject(error.message || error)
	}
}
