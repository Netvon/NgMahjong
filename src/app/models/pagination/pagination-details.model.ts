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

	get pagesArray(): number[] {
		let pages = Array(this.pages).fill(undefined).map((x, i) => i + 1)

		if ( pages.length > 20 && this.page >= 3 ) {
			pages = pages.slice(this.page - 3, this.page)
					.concat(pages.slice(this.page, this.page + 2))
		} else if ( pages.length > 20 && this.page < 3 ) {
			pages = pages.slice(0, this.page + 3)
					.concat(pages.slice(this.page + 3, this.page + 5))
		}

		if ( !pages.includes(1) ) {
			pages.unshift(1)
		}

		if ( !pages.includes(this.pages) ) {
			pages.push(this.pages)
		}

		return pages
	}

	constructor(public total: number, public perPage: number, public pageZeroBased: number) { }
}
