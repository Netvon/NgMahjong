import {TemplateTile} from "../tile/template-tile.model";

export class Template {
    tiles: TemplateTile[]

    get width(): number {
        return this.tiles.sort((a, b) => b.xPos - a.xPos)[0].xPos + 1
    }

    get height(): number {
        return this.tiles.sort((a, b) => b.yPos - a.yPos)[0].yPos + 1
    }

    get depth(): number {
        return this.tiles.sort((a, b) => b.zPos - a.zPos)[0].zPos + 1
    }
}
