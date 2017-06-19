import {Tile} from './tile.model'
import {TileDetail} from './tile-detail.model'

export class PlayingTile extends Tile {
	_id: string
	tile: TileDetail
	// match?: Match       Here comes the new match object

	fromJson(json: { xPos: number, yPos: number, zPos: number, _id: string, tile: any }) {
		super.fromJson(json)

		this._id = json._id
		this.tile = new TileDetail().fromJson(json.tile)

		return this
	}

}
