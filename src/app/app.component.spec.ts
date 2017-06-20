import { TestBed, async } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'

import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { StorageService, AuthService } from './service'
import { AppRoutingModule } from './app-routing.module'
import {
	LoggedOutComponent,
	GameOverviewComponent,
	GameCreateComponent,
	GameDetailComponent,
	LoginCallbackComponent,
	PaginationComponent,
	GameTemplateViewComponent,
	LoadingIndicatorComponent,
	PlayingGameViewComponent
} from './components'
import { MomentModule } from 'angular2-moment'
import { TileHintablePipe } from 'app/pipes/tile-hintable.pipe'
import { TileSelectablePipe } from 'app/pipes/tile-selectable.pipe'


class MockStorageService {
	private storage = new Map<string, string>()

	get(key: string) {
		return this.storage.get(key)
	}

	set(key: string, value: string) {
		this.storage.set(key, value)
	}

	remove(key: string) {
		this.storage.delete(key)
	}

	has(key: string) {
		return this.get(key) !== null
	}
}

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent,
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
				{ provide: StorageService, useClass: MockStorageService },
				{ provide: AuthService, useClass: AuthService },
				{ provide: APP_BASE_HREF, useValue : '/' }
			]
		}).compileComponents()
	}))

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.debugElement.componentInstance
		expect(app).toBeTruthy()
	}))
})
