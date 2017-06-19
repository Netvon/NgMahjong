
import {Board} from './board.model'
import {Tile} from '../tile/tile.model'

export class TemplateBoard extends Board {
	id: string

	fromJson(json: { id: string, tiles: any[] }) {
		this.id =  json.id
		this.tiles = json.tiles.map(x => new Tile().fromJson(x))

		return this
	}

}
