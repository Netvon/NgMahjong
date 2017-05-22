import {PlayingTile} from "../../models/tile/playing-tile.model";

export class TileViewModel extends PlayingTile {
    x: number
    y: number

    fromTemplateTile(tile: PlayingTile, x?: number, y?: number) {
        this.xPos = tile.xPos
        this.yPos = tile.yPos
        this.zPos = tile.zPos

        this.x = x
        this.y = y

        return this
    }
}
