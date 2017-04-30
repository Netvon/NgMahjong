import { Injectable } from '@angular/core'
import { Http, RequestOptions } from '@angular/http'

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable'

import { GameTemplate, GameState, Game, Pagination, TokenInfo, UserInGame, ApiResponse } from '../models'

@Injectable()
export class GameService {

	private baseUrl = 'http://mahjongmayhem.herokuapp.com'

	constructor(private http: Http) { }

	getTemplates(): Observable<GameTemplate[]> {
		return this.http.get(`${this.baseUrl}/gameTemplates`)
						.map(res => res.json() as GameTemplate[])
						.catch(this.handleError)
	}

	getTemplate(id: string): Observable<GameTemplate> {
		return this.http.get(`${this.baseUrl}/gameTemplates/${id}`)
						.map(res => res.json() as GameTemplate)
						.catch(this.handleError)
	}

	getGame(id: string): Observable<Game> {
		const url = `${this.baseUrl}/games/${id}`

		return this.http.get(url)
						.map(res => res.json() as Game)
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

							const perPage 	= +res.headers.get('x-page-size')
							const page 		= +res.headers.get('x-page-index')
							const total 	= +res.headers.get('x-total-count')

							return new Pagination(res.json() as Game[], total, perPage, page)
						})
						.catch(this.handleError)
	}

	startGame(id: string, token: TokenInfo): Promise<ApiResponse> {
		const url = `${this.baseUrl}/games/${id}`

		const headers = new Headers(token.toHeaders())
		const options = new RequestOptions(headers)

		return this.http.post(url, null, options)
						.toPromise()
						.then(res => {
							return {
								message: res.json().message as string || res.json() as string,
								status: res.status
							}
						})
						.catch(this.handleError)
	}

	getToken(): Promise<TokenInfo> {
		return Promise.resolve({
			username: 'tme.vannimwegen@student.avans.nl',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.dUJSESU41icAYhvVnFgvlTrpl4-D2WTTsV3i_1FuZk8'
		})
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error)

		return Promise.reject(error.message || error)
	}
}
