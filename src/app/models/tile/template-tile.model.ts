import {Tile} from "./tile.model";
export class TemplateTile {
	xPos: number
	yPos: number
	zPos: number
	_id?: string
	tile?: Tile

	fromJson(json: { xPos: number, yPos: number, zPos: number, _id?: string, tile?: any }) {
		this.xPos = json.xPos
		this.yPos = json.yPos
		this.zPos = json.zPos
		this._id = json._id

		if(json.tile){
			this.tile = new Tile().fromJson(json.tile)
		}

		return this
	}

	// get x(): number {
	// 	return ((this.xPos - .5) + ((this.zPos - 1) / 2)) / 2
	// }

	// get y(): number {
	// 	return ((this.yPos - .5) + ((this.zPos - 1) / 2)) / 2
	// }
}
