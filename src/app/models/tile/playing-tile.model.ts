import { Tile } from './tile.model'
import { TileDetail } from './tile-detail.model'
import { Match } from './match.model'

export class PlayingTile extends Tile {
	_id: string
	tile: TileDetail
	match?: Match

	fromJson(json: { xPos: number, yPos: number, zPos: number, _id: string, tile: any, match?: any }) {
		super.fromJson(json)

		this._id = json._id
		this.tile = new TileDetail().fromJson(json.tile)

		if (json.match) {
			this.match = new Match().fromJson(json.match)
		}


		return this
	}

}
