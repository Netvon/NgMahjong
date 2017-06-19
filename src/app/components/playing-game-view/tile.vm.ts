import { PlayingTile, SpriteSheet } from 'app/models'
import values from 'lodash/values'

export class TileViewModel extends PlayingTile {
	x: number
	y: number
	width: number
	height: number

	spriteSource: string

	static loadGroupedBoard(from: PlayingTile[], spriteSheet: SpriteSheet, withMatches: boolean = false): Array<TileViewModel[]> {

		if(!withMatches){
			let newFrom = []
			for(let tile of from){
				if(!tile.match){
					newFrom.push(tile)
				}
			}
			from = newFrom
		}


		const mapped = from.map(a => {
			return new TileViewModel(a,
				spriteSheet.getTileSprite(a.tile),
				spriteSheet.calculateX(a),
				spriteSheet.calculateY(a),
				spriteSheet.spriteWidth,
				spriteSheet.spriteHeight)
		})

		const result = this.orderTilesByShadow(mapped)

		return values(result)
	}

	static orderTilesByShadow(tiles: TileViewModel[]): Array<TileViewModel[]> {
		// Lets start with some variables
		const dict = {}
		let maxZ = 0
		let maxX = 0
		let maxY = 0
		const result = []

		// Make a dictionary of tiles, so it is easier to get a tile at a certain position
		// Also get the maximum z, x and y value
		for (const tile of tiles) {
			if (!dict[tile.zPos]) {
				dict[tile.zPos] = {}
			}
			if (!dict[tile.zPos][tile.xPos]) {
				dict[tile.zPos][tile.xPos] = {}
			}
			dict[tile.zPos][tile.xPos][tile.yPos] = tile
			if (tile.zPos > maxZ) {
				maxZ = tile.zPos
			}
			if (tile.xPos > maxX) {
				maxX = tile.xPos
			}
			if (tile.yPos > maxY) {
				maxY = tile.yPos
			}
		}

		// Here is where the fun(ordering) begins
		for (let z = 0; z <= maxZ; z++) {

			// Make sure each z index has a separate array
			result.push([])

			// Loop through all possible positions where a tile might be, in order from each y value
			for (let y = 0; y <= maxY; y++) {
				for (let x = maxX; x >= 0; x--) {

					// Check if there is a tile on this position
					if (dict[z] && dict[z][x] && dict[z][x][y]) {

						// Check if there are tiles nearby which get a higher priority
						this.checkForTilePriority(dict, z, x, y, maxX, result)

						// Add the tile to the final result array
						result[z].push(dict[z][x][y])

					}

				}
			}
		}

		return result
	}


	static checkForTilePriority(dict, z, x, y, maxX, result) {

		// Check if there is a stupid tile nearby which gets a higher priority
		if (dict[z] && dict[z][x + 2] && dict[z][x + 2][y + 1]) {

			// If there is, (only) the tiles which are next to it also get a higher priority
			// So loop through and get a number how many tiles are next to each other
			let tilesRight = x + 2
			for (tilesRight; tilesRight <= maxX; tilesRight = tilesRight + 2) {
				if (!(dict[z] && dict[z][tilesRight] && dict[z][tilesRight][y + 1])) {
					break
				}
			}

			// Now loop through all those tiles
			for (let xx = tilesRight; xx >= x + 2; xx = xx - 2) {
				if (dict[z] && dict[z][xx] && dict[z][xx][y + 1]) {
					// Also those tiles could have tiles nearby that have a higher priority, so check that too with this function
					this.checkForTilePriority(dict, z, xx, y + 1, maxX, result)

					// Hurray, finally add the tiles to the final result array
					result[z].push(dict[z][xx][y + 1])

					// And delete it from the total array, so it doesn't get added twice
					delete dict[z][xx][y + 1]
				}
			}

		}


	}

	constructor(tile: PlayingTile, spriteSource: string, x: number, y: number, width: number, height: number) {
		super()

		this.xPos = tile.xPos
		this.yPos = tile.yPos
		this.zPos = tile.zPos
		this.tile = tile.tile
		this.match = tile.match
		this._id = tile._id

		this.spriteSource = spriteSource

		this.x = x
		this.y = y

		this.width = width
		this.height = height

	}



}
