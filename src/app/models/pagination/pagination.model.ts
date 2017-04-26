import { PaginationDetails } from './pagination-details.model'

export class Pagination<T> extends PaginationDetails implements Iterable<T>  {

	[Symbol.iterator](): Iterator<T> {
		let cursor = 0
		const items = this.items

		return {
			next(): IteratorResult<T> {
				if (cursor < items.length) {
					return {
						done: false,
						value: items[cursor++]
					}
				} else {
					return {
						done: true,
						value: null
					}
				}
			}
		}
	}

	constructor(public items: T[], public total: number, public perPage: number, public pageZeroBased: number) {
		super(total, perPage, pageZeroBased)
	}
}
