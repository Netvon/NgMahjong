export class PaginationDetails {
	get pages(): number {
		return Math.ceil(this.total / this.perPage)
	}

	get hasNext(): boolean {
		return this.pages !== this.page
	}

	get hasPrevious(): boolean {
		return this.page > 1
	}

	get next(): number {
		return this.page + 1
	}

	get previous(): number {
		return this.page - 1
	}

	get page(): number {
		return this.pageZeroBased + 1
	}

	constructor(public total: number, public perPage: number, public pageZeroBased: number) { }
}
