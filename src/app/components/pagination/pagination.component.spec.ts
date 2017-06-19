import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PaginationComponent } from './pagination.component'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

describe('PaginationComponent', () => {
	let component: PaginationComponent
	let fixture: ComponentFixture<PaginationComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule ],
			declarations: [ PaginationComponent ]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(PaginationComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
