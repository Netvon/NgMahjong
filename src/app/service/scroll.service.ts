import { Injectable } from '@angular/core'

@Injectable()
export class ScrollService {
	scrollToTop() {
		window.scrollTo(0, 0)
	}
}
