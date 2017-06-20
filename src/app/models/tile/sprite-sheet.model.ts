
import { PlayingTile } from './playing-tile.model'
import { TileDetail } from './tile-detail.model'
export class SpriteSheet {

	imageSource: string
	spriteWidth: number
	spriteHeight: number
	spriteTopShadow = 0
	spriteRightShadow = 0
	spriteBottomShadow = 0.09
	spriteLeftShadow = 0.09


	constructor(imageSource: string, spriteWidth: number, spriteHeight: number) {
		this.spriteWidth = 1
		this.spriteHeight = (spriteHeight / spriteWidth)
		this.imageSource = imageSource
	}

	getTileSprite(tile: TileDetail) {

		return `${this.imageSource}/${tile.suit}${tile.name}.png`
	}


	calculateX(tile: PlayingTile) {

		return (((tile.xPos - 1 ) / 2) * (this.spriteWidth - this.spriteLeftShadow + this.spriteRightShadow))
	}

	calculateY(tile: PlayingTile) {

		return (((tile.yPos) / 2) * (this.spriteHeight - this.spriteBottomShadow + this.spriteTopShadow))
	}

	calculateTotalWidth(xTiles: number) {
		return this.spriteWidth * ((xTiles - 1) / 2)
	}

	calculateTotalHeight(yTiles: number) {
		return this.spriteHeight * ((yTiles + 1) / 2)
	}


}
