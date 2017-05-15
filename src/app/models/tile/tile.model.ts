export class Tile {
	id: string
	suit: string
	name: string
	matchesWholeSuit: boolean

	fromJson(json: { id: string, suit: string, name: string, matchesWholeSuit: boolean }) {
		this.id = json.id
		this.suit = json.suit
		this.name = json.name
		this.matchesWholeSuit = json.matchesWholeSuit

		return this
	}

}
