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
}
