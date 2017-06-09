export class Tile {
	xPos: number
	yPos: number
	zPos: number

	fromJson(json: { xPos: number, yPos: number, zPos: number }) {
		this.xPos = json.xPos
		this.yPos = json.yPos
		this.zPos = json.zPos

		return this
	}

}
