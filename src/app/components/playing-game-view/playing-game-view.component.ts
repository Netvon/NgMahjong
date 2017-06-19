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
import { TileSelectablePipe } from '../../pipes/tile-selectable.pipe'
import { Subject } from 'rxjs/Subject'

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
	gameBoard: PlayingBoard
	groupedBoard: Array<TileViewModel[]>

	private spriteSheet: SpriteSheet
	private selectedTile
	private sendMatchQueue = []


	constructor(private gameService: GameService, private route: ActivatedRoute) {
		this.spriteSheet = new SpriteSheet('../../../assets/Tiles-1', 349, 480)
	}

	get viewBox(): string {
		if (this.gameBoard) {
			const width = this.spriteSheet.calculateTotalWidth(this.gameBoard.width)
			const height = this.spriteSheet.calculateTotalHeight(this.gameBoard.height)
			return `0 0 ${width} ${height}`
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
	}

	loadGroupedBoard() {

		if (this.gameBoard) {
			this.groupedBoard = TileViewModel.loadGroupedBoard(this.gameBoard.tiles, this.spriteSheet)
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

	selectTile(selectedTile: PlayingTile) {

		if (this.isPlayer && this.gameBoard.tileSelectable(selectedTile)) {

			if (this.tileSelected(selectedTile)) {
				this.selectedTile = null
			} else if (this.selectedTile) {

				if (this.gameId) {

					if (this.gameBoard.tilesMatchable(selectedTile, this.selectedTile)) {

						this.gameBoard.tiles.splice(this.gameBoard.tiles.map((e) => e._id).indexOf(selectedTile._id), 1)
						this.gameBoard.tiles.splice(this.gameBoard.tiles.map((e) => e._id).indexOf(this.selectedTile._id), 1)

						this.loadGroupedBoard()

						this.addMatchToQueue(new PostMatch(this.gameId, selectedTile._id, this.selectedTile._id))

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
}
