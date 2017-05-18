import { TemplateTile } from '../tile/template-tile.model'
import {Template} from "./template.model";

export class GameTemplate extends Template {
	id: string

	fromJson(json: { id: string, tiles: any[] }) {
		this.id =  json.id
		this.tiles = json.tiles.map(x => new TemplateTile().fromJson(x))

		return this
	}

}
