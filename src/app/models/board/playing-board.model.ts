
import {Board} from './board.model'
import {PlayingTile} from '../tile/playing-tile.model'

export class PlayingBoard extends Board {
	tiles: PlayingTile[]

	fromJson(json: any[] ) {
		this.tiles = json.map(x => new PlayingTile().fromJson(x))

		return this
	}

}
