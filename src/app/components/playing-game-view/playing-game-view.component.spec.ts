import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PlayingGameViewComponent } from './playing-game-view.component'

describe('GameTemplateViewComponent', () => {
	let component: PlayingGameViewComponent
	let fixture: ComponentFixture<PlayingGameViewComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PlayingGameViewComponent]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(PlayingGameViewComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
