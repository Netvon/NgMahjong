
import { Board } from './board.model'
import { PlayingTile } from '../tile/playing-tile.model'
import { Subject } from 'rxjs/Subject'

export class PlayingBoard extends Board {
	tiles: PlayingTile[]

	hintTiles: Subject<PlayingTile[]> = new Subject()

	fromJson(json: any[]) {
		this.tiles = json.map(x => new PlayingTile().fromJson(x))

		return this
	}


	amountOfMatches(): number {
		let amount = 0
		for(let tile of this.tiles){
			if(tile.match){
				amount++
			}
		}
		console.log(amount)
		return amount
	}

	tilesSortedByMatchDate(): PlayingTile[]{

		let tiles = []
		for(let tile of this.tiles){
			if(tile.match){
				tiles.push(tile)
			}
		}

		return tiles.sort((n1,n2) => {
			if (n1.match.foundOn > n2.match.foundOn) {
				return -1;
			}

			if (n1.match.foundOn < n2.match.foundOn) {
				return 1;
			}

			return 0;
		});

	}


	tileSelectable(selectableTile: PlayingTile) {

		if(selectableTile.match){
			return false;
		}

		let tileLeft = false
		let tileRight = false

		for (const tile of this.tiles) {
			if (tile._id === selectableTile._id || tile.match) {
				continue
			}

			if (selectableTile.zPos < tile.zPos &&
				(tile.xPos + 1 >= selectableTile.xPos && tile.xPos - 1 <= selectableTile.xPos) &&
				(tile.yPos + 1 >= selectableTile.yPos && tile.yPos - 1 <= selectableTile.yPos)) {

				return false
			}

			if (selectableTile.zPos === tile.zPos && (selectableTile.yPos >= tile.yPos - 1 && selectableTile.yPos <= tile.yPos + 1)) {
				if (tile.xPos - 2 === selectableTile.xPos) {
					tileLeft = true
				}
				if (tile.xPos + 2 === selectableTile.xPos) {
					tileRight = true
				}
				if (tileLeft && tileRight) {
					return false
				}
			}
		}

		return true
	}

	tilesMatchable(tile1: PlayingTile, tile2: PlayingTile) {

		return ((tile1.tile.suit === tile2.tile.suit) &&
			((tile1.tile.matchesWholeSuit && tile2.tile.matchesWholeSuit) ||
				(tile1.tile.name === tile2.tile.name)))
	}

	showHintTiles() {

		const selectableTiles = this.tiles.filter(tile => this.tileSelectable(tile))

		for (let i = selectableTiles.length - 1; i >= 0; i--) {
			for (let j = 0; j < selectableTiles.length - 1; j++) {
				if (this.tilesMatchable(selectableTiles[i], selectableTiles[j])) {
					this.hintTiles.next([selectableTiles[j], selectableTiles[i]])
					return
				}
			}
			selectableTiles.splice(i, 1)
		}

		console.log('No more tiles are matchable...')

	}

}
