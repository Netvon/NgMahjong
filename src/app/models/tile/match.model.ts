
export class Match {

	foundBy: string
	otherTileId: string
	foundOn: string

	constructor(foundBy?: string, otherTileId?: string, foundOn?: string) {
		this.foundBy = foundBy
		this.otherTileId = otherTileId
		this.foundOn = foundOn
	}


	fromJson(json: { foundBy: string, otherTileId: string, foundOn: string }) {

		this.foundBy = json.foundBy
		this.otherTileId = json.otherTileId
		this.foundOn = json.foundOn

		return this
	}

}
