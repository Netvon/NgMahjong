import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'

import { GameTemplate, TemplateTile } from '../../models'
import { GameService } from '../../service/game.service'
import { TemplateTileViewModel } from './template-tile.vm'

import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import {Template} from "../../models/game/template.model";

@Component({
	selector: 'app-game-template-view',
	templateUrl: './game-template-view.component.html',
	styleUrls: ['./game-template-view.component.scss']
})
export class GameTemplateViewComponent implements OnInit, OnChanges {

	@Input() gameTemplate: Template
	@Input() gameTemplateId: string
	@Input() tileScale = 2
	@Input() tileSize = 1
	@Input() tileXSize = 1.9
	@Input() tileYSize = 1.9
	@Input() tileZOffsetX = 0
	@Input() tileZOffsetY = 0
	@Input() tileRadius = .25
	@Input() tileClass = ['template-tile']
	@Input() containerClass = ['template-view']
	@Input() tileStroke = 'black'
	@Input() tileStrokeWidth = 0.1

	get tileSizeAdjusted(): number {
		return this.tileSize / this.tileScale
	}

	get zSortedTiles(): TemplateTile[] {
		if ( this.gameTemplate ) {
			return this.gameTemplate.tiles.sort((a, b) => a.zPos - b.zPos)
		}

		return new Array<TemplateTile>()
	}

	get zGroupedTiles(): Array<TemplateTileViewModel[]> {
		if ( this.gameTemplate ) {
			console.log(this.gameTemplate)
			const mapped = this.gameTemplate.tiles.map(a => {
				return new TemplateTileViewModel().fromTemplateTile(a, this.calculateX(a), this.calculateY(a))
			})

			const grouped = groupBy(mapped, b => b.zPos)

			return values(grouped)
		}

		return [[]]
	}

	get viewBox(): string {
		if ( this.gameTemplate ) {
			return `0 0 ${this.gameTemplate.width} ${this.gameTemplate.height}`
		}

		return '0 0 0 0'
	}

	constructor(
		private gameService: GameService
	) { }

	ngOnInit() {
		if ( this.gameTemplateId ) {
			this.loadTemplate()
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ( changes.gameTemplateId ) {
			this.loadTemplate()
		}
	}

	calculateX(tile: TemplateTile) {
		return this.calculate(tile, tile.xPos)
	}

	calculateY(tile: TemplateTile) {
		// return ((tile.yPos - .5) + ((tile.zPos - 1) / 2)) / 2
		return this.calculate(tile, tile.yPos)
	}

	private calculate(tile: TemplateTile, pos: number) {
		return pos - this.tileSize
		// return ((pos - this.tileSizeAdjusted) + ((tile.zPos - this.tileSize) / this.tileScale)) / this.tileScale
	}

	private loadTemplate() {
		this.gameTemplate = null
		this.gameService.getTemplate(this.gameTemplateId)
						.subscribe(x => {
							this.gameTemplate = x
						})
	}

	tileSelectable(){



		return true
	}




}
