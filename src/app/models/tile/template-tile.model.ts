export class TemplateTile {
	xPos: number
	yPos: number
	zPos: number
	_id?: string

	fromJson(json: { xPos: number, yPos: number, zPos: number, _id?: string }) {
		this.xPos = json.xPos
		this.yPos = json.yPos
		this.zPos = json.zPos
		this._id = json._id

		return this
	}

	// get x(): number {
	// 	return ((this.xPos - .5) + ((this.zPos - 1) / 2)) / 2
	// }

	// get y(): number {
	// 	return ((this.yPos - .5) + ((this.zPos - 1) / 2)) / 2
	// }
}
