import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core'

import { GameService } from '../../service/game.service'
import { TemplateTileViewModel } from '../game-template-view/template-tile.vm'
import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import { TileViewModel } from './tile.vm'
import { PlayingBoard } from '../../models/board/playing-board.model'
import { PlayingTile } from '../../models/tile/playing-tile.model'
import { SpriteSheet } from '../../models/tile/sprite-sheet.model'
import { ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { PostMatch } from '../../models/tile/post-match.model'

@Component({
	selector: 'app-playing-game-view',
	templateUrl: './playing-game-view.component.html',
	styleUrls: ['./playing-game-view.component.scss']
})
export class PlayingGameViewComponent implements OnInit {


	@Input() gameId: string
	@Input() tileZOffsetX = 0.15
	@Input() tileZOffsetY = -0.15
	@Input() containerClass = ['template-view']
	@Input() tileClass = ['template-tile']
	@Input() isPlayer = false

	board: Observable<PlayingBoard>
	matchMessages: Observable<PostMatch>
	gameBoard: PlayingBoard
	groupedBoard: Array<TileViewModel[]>

	private spriteSheet: SpriteSheet
	private selectedTile
	private hintTiles: TileViewModel[] = []
	private sendMatchQueue = []


	constructor(private gameService: GameService, private route: ActivatedRoute) {
		this.spriteSheet = new SpriteSheet('../../../assets/Tiles-1', 349, 480)
	}

	get viewBox(): string {
		if (this.gameBoard) {
			return `0 0 ${this.spriteSheet.calculateTotalWidth(this.gameBoard.width)} ${this.spriteSheet.calculateTotalHeight(this.gameBoard.height)}`
		}

		return '0 0 0 0'
	}

	ngOnInit() {

		this.getGameBoard()

	}

	getGameBoard() {
		this.board = this.gameService.getPlayingBoard(this.gameId)
		this.board.subscribe(results => {
			this.gameBoard = results
			this.loadGroupedBoard()
		})

		this.matchMessages = this.gameService.getMatchMessages(this.gameId)
		this.matchMessages.subscribe(results => {
			console.log(results)
			this.removePostMatchTiles(results)

		})

	}


	loadGroupedBoard(): Array<TileViewModel[]> {

		if (this.gameBoard) {
			const mapped = this.gameBoard.tiles.map(a => {
				return new TileViewModel(a,
					this.spriteSheet.getTileSprite(a.tile),
					this.spriteSheet.calculateX(a),
					this.spriteSheet.calculateY(a),
					this.spriteSheet.spriteWidth,
					this.spriteSheet.spriteHeight)
			})

			const result = this.orderTilesByShadow(mapped)

			this.groupedBoard = values(result)
			return values(result)
		}

		return [[]]
	}


	orderTilesByShadow(tiles: TileViewModel[]): Array<TileViewModel[]> {
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


	checkForTilePriority(dict, z, x, y, maxX, result) {

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


	addMatchToQueue(postMatch: PostMatch) {

		if (this.sendMatchQueue.length === 0) {
			this.sendMatchQueue.push(postMatch)
			this.executeMatchQueue()
		} else {
			this.sendMatchQueue.push(postMatch)
		}

	}

	private executeMatchQueue() {
		if (this.sendMatchQueue.length !== 0) {
			this.gameService.getToken()
				.switchMap(token => {
					console.log('Send match')
					return this.gameService.postMatch(this.sendMatchQueue[0], token)
				})
				.subscribe(x => {
					console.log('Recieve match')
					this.sendMatchQueue.splice(0, 1)
					this.executeMatchQueue()
				})
		}

	}


	removePostMatchTiles(postMatch: PostMatch){

		if(this.gameBoard.tiles.map((e) => e._id).indexOf(postMatch.tile1Id) != -1){
			this.gameBoard.tiles.splice(this.gameBoard.tiles.map((e) => e._id).indexOf(postMatch.tile1Id), 1)
		}

		if(this.gameBoard.tiles.map((e) => e._id).indexOf(postMatch.tile2Id) != -1){
			this.gameBoard.tiles.splice(this.gameBoard.tiles.map((e) => e._id).indexOf(postMatch.tile2Id), 1)
		}

		this.loadGroupedBoard()
	}



	selectTile(selectedTile: PlayingTile) {

		if (this.isPlayer && this.tileSelectable(selectedTile)) {

			if (this.tileSelected(selectedTile)) {
				this.selectedTile = null
			} else if (this.selectedTile) {

				if (this.gameId) {

					if (this.tilesMatchable(selectedTile, this.selectedTile)) {

						const postMatch = new PostMatch(this.gameId, selectedTile._id, this.selectedTile._id);

						this.removePostMatchTiles(postMatch)

						this.addMatchToQueue(postMatch)

						this.selectedTile = null

					} else {
						console.log('These 2 tiles are not matchable...')
						this.selectedTile = null
					}

				} else {
					console.log('The game id has not been passed through to the board...')
				}

			} else {
				this.selectedTile = selectedTile
			}
		}
	}

	tileSelected(tile: PlayingTile) {
		return (this.selectedTile != null && this.selectedTile._id === tile._id)
	}


	tilesMatchable(tile1: PlayingTile, tile2: PlayingTile) {

		return ((tile1.tile.suit === tile2.tile.suit) &&
			((tile1.tile.matchesWholeSuit && tile2.tile.matchesWholeSuit) ||
			(tile1.tile.name === tile2.tile.name)))
	}


	tileSelectable(selectableTile: PlayingTile) {

		let tileLeft = false
		let tileRight = false

		for (const tile of this.gameBoard.tiles) {
			if (tile._id === selectableTile._id) {
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


	showHintTiles() {

		// this.gameService.testMatchMessages(this.gameId).subscribe(results => {
		// 	console.log(results)
		// })

		const selectableTiles = []
		for (const layer of this.groupedBoard) {
			for (const tile of layer) {
				if (this.tileSelectable(tile)) {
					selectableTiles.push(tile)
				}
			}
		}

		for (let i = selectableTiles.length - 1; i >= 0; i--) {
			for (let j = 0; j < selectableTiles.length - 1; j++) {
				if (this.tilesMatchable(selectableTiles[i], selectableTiles[j])) {
					this.hintTiles.splice(0, this.hintTiles.length)
					this.hintTiles.push(selectableTiles[j])
					this.hintTiles.push(selectableTiles[i])
					return
				}
			}
			selectableTiles.splice(i, 1)
		}

		console.log('No more tiles are matchable...')

	}

	tileHintable(hintableTile: PlayingTile) {
		return (this.hintTiles.map(function (e) { return e._id }).indexOf(hintableTile._id) !== -1)
	}


}
