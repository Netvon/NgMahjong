import { OnInit, Component, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { PaginationDetails} from 'app/models'

import 'rxjs/add/operator/switchMap'

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

	@Input() pagination: PaginationDetails
	@Input() url: string

	params: { [key: string]: any }

	constructor(
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(x => {
			this.params = Object.assign({ }, x)

			delete this.params['page']
		})
	}
}
