import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing'

import { GameCreateComponent } from './game-create.component'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { GameTemplateViewComponent, LoadingIndicatorComponent } from '../../components'
import { GameService } from '../../service'

import { RouterTestingModule } from '@angular/router/testing'
import { Observable } from 'rxjs/Observable'
import { TemplateBoard, Tile, TokenInfo } from 'app/models'

class MockGameService {
	getTemplates(): Observable<TemplateBoard[]> {
		return Observable.of([
			new TemplateBoard().fromJson({ id: 'abc', tiles: [ new Tile().fromJson({ xPos: 0, yPos: 0, zPos: 0}) ]}),
			new TemplateBoard().fromJson({ id: 'cba', tiles: [ new Tile().fromJson({ xPos: 0, yPos: 0, zPos: 0}) ]})
		])
	}

	getToken(): Observable<TokenInfo> {
		const info = new TokenInfo()
		info.token = 'abc'
		info.username = 'abc'

		return Observable.of(info)
	}
}

let compiled: any

describe('GameCreateComponent', () => {
	let component: GameCreateComponent
	let fixture: ComponentFixture<GameCreateComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserModule, FormsModule, HttpModule, RouterTestingModule.withRoutes([]) ],
			declarations: [GameTemplateViewComponent, GameCreateComponent, LoadingIndicatorComponent],
			providers: [
				{ provide: GameService, useClass: MockGameService },
			]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(GameCreateComponent)
		component = fixture.componentInstance
		compiled = fixture.debugElement.nativeElement
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('should not render options before async request', () => {
		expect(compiled.querySelector('option')).toBeNull()
	})

	it('should render template options after async request', () => {
		fixture.whenStable().then(() => {
			fixture.detectChanges()
				expect(compiled.querySelectorAll('option').length).toEqual(2)
		})
	})
})
