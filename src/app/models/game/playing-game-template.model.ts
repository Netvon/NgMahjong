import { TemplateTile } from '../tile/template-tile.model'
import {Template} from "./template.model";

export class PlayingGameTemplate extends Template{

    fromJson(json: any[] ) {
        this.tiles = json.map(x => new TemplateTile().fromJson(x))

        return this
    }

    // get zSortedTiles(): TemplateTile[] {
    // 	return this.tiles.sort((a, b) => a.zPos - b.zPos)
    // }

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
