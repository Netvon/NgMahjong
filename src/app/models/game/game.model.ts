import { User } from '../user/user.model'
import { GameState } from './game-state.enum'

export class Game {
	id: string
	gameTemplate: { id: string }

	createdOn: Date
	startedOn: Date
	endedOn: Date

	createdBy: User

	minPlayers: number
	maxPlayers: number

	players: User[]

	state: GameState

	get hasPlaceLeft(): boolean {
		return this.players.length < this.maxPlayers
	}

	get canJoin(): boolean {
		return this.hasPlaceLeft && +GameState[this.state] === GameState.open
	}

	fromJSON(json: {
		id: string,
		gameTemplate: { id: string },
		createdOn: Date,
		startedOn: Date,
		endedOn: Date,
		createdBy: any,
		minPlayers: number,
		maxPlayers: number,
		players: any[],
		state: GameState
	}) {
		this.id = json.id
		this.gameTemplate = { id: json.gameTemplate.id }
		this.createdOn = json.createdOn
		this.endedOn = json.endedOn
		this.minPlayers = json.minPlayers
		this.maxPlayers = json.maxPlayers

		this.state = json.state as GameState

		this.createdBy = new User(json.createdBy._id, json.createdBy.name)
		this.players = new Array<User>()

		for (const player of json.players) {
			this.players.push(new User(player._id, player.name))
		}

		return this
	}

	// get canJoin(): boolean {
	// 	return true//this.state === GameState.open
	// }
}
