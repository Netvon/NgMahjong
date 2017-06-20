import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser'

import { LoginCallbackComponent } from './login-callback.component'
import { AppRoutingModule } from 'app/app-routing.module'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import {
	LoggedOutComponent,
	GameOverviewComponent,
	GameCreateComponent,
	GameDetailComponent,
	GameTemplateViewComponent,
	PaginationComponent,
	LoadingIndicatorComponent,
	PlayingGameViewComponent
} from 'app/components'
import { TileSelectablePipe } from 'app/pipes/tile-selectable.pipe'
import { TileHintablePipe } from 'app/pipes/tile-hintable.pipe'
import { MomentModule } from 'angular2-moment'

describe('LoginCallbackComponent', () => {
	let component: LoginCallbackComponent
	let fixture: ComponentFixture<LoginCallbackComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				LoginCallbackComponent,
				LoggedOutComponent,
				GameOverviewComponent,
				GameCreateComponent,
				GameDetailComponent,
				LoginCallbackComponent,
				GameTemplateViewComponent,
				PaginationComponent,
				LoadingIndicatorComponent,
				PlayingGameViewComponent,
				TileSelectablePipe,
				TileHintablePipe,
			],
			imports: [
				BrowserModule,
				FormsModule,
				AppRoutingModule,
				MomentModule
			],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						params: Observable.of({ username: 'abc', token: 'abc' })
					}
				}
			]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginCallbackComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
