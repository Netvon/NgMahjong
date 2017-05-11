import {Component, Input} from '@angular/core'

import { Game, Pagination} from '../../models'

import 'rxjs/add/operator/switchMap'
import { PaginationDetails } from '../../models/pagination/pagination-details.model'

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

	@Input() pagination: PaginationDetails
	@Input() url: string

}
