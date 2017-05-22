import {PlayingTile} from "../../models/tile/playing-tile.model";

export class TileViewModel extends PlayingTile {
    x: number
    y: number
    width: number
    height: number

    spriteSource: string

    constructor(tile: PlayingTile, spriteSource: string, x: number, y: number, width: number, height: number) {
        super();

        this.xPos = tile.xPos
        this.yPos = tile.yPos
        this.zPos = tile.zPos
        this.tile = tile.tile
        this._id = tile._id

        this.spriteSource = spriteSource

        this.x = x
        this.y = y

        this.width = width
        this.height = height

    }

}
