import { Pipe, PipeTransform } from '@angular/core'
import { PlayingTile, PlayingBoard } from 'app/models'

@Pipe({
	name: 'tileSelectable',
})
export class TileSelectablePipe implements PipeTransform {

	transform(value: PlayingTile, args: PlayingBoard): boolean {
		return args.tileSelectable(value)
	}
}
