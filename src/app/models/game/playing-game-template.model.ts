import { TemplateTile } from '../tile/template-tile.model'
import {Template} from "./template.model";

export class PlayingGameTemplate extends Template{

    fromJson(json: any[] ) {
        this.tiles = json.map(x => new TemplateTile().fromJson(x))

        return this
    }

}
