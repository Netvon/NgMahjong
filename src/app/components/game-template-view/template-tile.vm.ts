import { TemplateTile } from 'app/models'

export class TemplateTileViewModel extends TemplateTile {
	x: number
	y: number

	fromTemplateTile(tile: TemplateTile, x?: number, y?: number) {
		this._id = tile._id
		this.xPos = tile.xPos
		this.yPos = tile.yPos
		this.zPos = tile.zPos

		this.x = x
		this.y = y

		return this
	}
}
