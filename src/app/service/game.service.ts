import { Injectable } from '@angular/core'
import { Http } from '@angular/http'

import 'rxjs/add/operator/toPromise'

import { GameTemplate, GameState, Game, Pagination } from '../models'

@Injectable()
export class GameService {

	private baseUrl = 'http://mahjongmayhem.herokuapp.com'

	constructor(private http: Http) { }

	getTemplates(): Promise<GameTemplate[]> {
		return this.http.get(`${this.baseUrl}/gameTemplates`)
						.toPromise()
						.then(res => res.json() as GameTemplate[])
						.catch(this.handleError)
	}

	getTemplate(id: string): Promise<GameTemplate> {
		return this.http.get(`${this.baseUrl}/gameTemplates/${id}`)
						.toPromise()
						.then(res => res.json() as GameTemplate)
						.catch(this.handleError)
	}

	getGames(
		pageSize: number,
		pageIndex: number,
		createdBy?: string,
		player?: string,
		gameTemplate?: string,
		state?: GameState): Promise<Pagination<Game>>  {
			return this.http.get(`${this.baseUrl}/games?pageSize=${pageSize}&pageIndex=${pageIndex}`)
						.toPromise()
						.then(res => {

							const perPage = Number.parseInt(res.headers.get('x-page-size'))
							const page = Number.parseInt(res.headers.get('x-page-index'))
							const total = Number.parseInt(res.headers.get('x-total-count'))

							return new Pagination(res.json() as Game[], total, perPage, page)
						})
						.catch(this.handleError)
		}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error)

		return Promise.reject(error.message || error)
	}
}
