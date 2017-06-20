import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GameTemplateViewComponent } from './game-template-view.component'

describe('GameTemplateViewComponent', () => {
	let component: GameTemplateViewComponent
	let fixture: ComponentFixture<GameTemplateViewComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GameTemplateViewComponent]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(GameTemplateViewComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
