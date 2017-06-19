import { TestBed, async } from '@angular/core/testing'

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
	GameTemplateViewComponent} from './components'
import { MomentModule } from 'angular2-moment'


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
				PaginationComponent
			],
			imports: [
				BrowserModule,
				FormsModule,
				AppRoutingModule,
				MomentModule
			],
			providers: [
				{ provide: StorageService, useClass: MockStorageService},
				{ provide: AuthService, useClass: AuthService}
			]
		}).compileComponents()
	}))

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.debugElement.componentInstance
		expect(app).toBeTruthy()
	}))

	it(`should have as title 'app works!'`, async(() => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.debugElement.componentInstance
		expect(app.title).toEqual('app works!')
	}))

	it('should render title in a h1 tag', async(() => {
		const fixture = TestBed.createComponent(AppComponent)
		fixture.detectChanges()
		const compiled = fixture.debugElement.nativeElement
		expect(compiled.querySelector('h1').textContent).toContain('app works!')
	}))
})
