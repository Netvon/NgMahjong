import {Tile} from "../../models/tile/tile.model";

export class TemplateTileViewModel extends Tile {
	x: number
	y: number

	fromTemplateTile(tile: Tile, x?: number, y?: number) {
		this.xPos = tile.xPos
		this.yPos = tile.yPos
		this.zPos = tile.zPos

		this.x = x
		this.y = y

		return this
	}
}
