import { TestBed, inject } from '@angular/core/testing'

import { ScrollService } from './scroll.service'

describe('StorageService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ScrollService]
		})
	})

	it('should ...', inject([ScrollService], (service: ScrollService) => {
		expect(service).toBeTruthy()
	}))
})
