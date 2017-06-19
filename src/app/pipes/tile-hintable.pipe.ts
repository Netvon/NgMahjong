import { Pipe, PipeTransform } from '@angular/core'
import { PlayingTile, PlayingBoard } from 'app/models'
import { TileViewModel } from 'app/components/playing-game-view/tile.vm'
import { Subject } from 'rxjs/Subject'

@Pipe({
	name: 'tileHintable',
	pure: false
})
export class TileHintablePipe implements PipeTransform {

	private isHintable = false

	transform(value: PlayingTile, args: Subject<TileViewModel[]>): boolean {

		args.subscribe(tiles => {
			this.isHintable = tiles.map(x => x._id).indexOf(value._id) !== -1
		})

		return this.isHintable
	}
}
