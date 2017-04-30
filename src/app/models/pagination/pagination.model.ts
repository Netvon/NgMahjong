import { PaginationDetails } from './pagination-details.model'

export class Pagination<T> extends PaginationDetails {
	constructor(public items: T[], public total: number, public perPage: number, public pageZeroBased: number) {
		super(total, perPage, pageZeroBased)
	}
}
