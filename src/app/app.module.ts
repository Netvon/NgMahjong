import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { MomentModule } from 'angular2-moment'

import { AppComponent } from './app.component'

import { GameService, AuthService } from './service'
import { GameOverviewComponent, GameDetailComponent, GameCreateComponent, LoginCallbackComponent } from './components'

import { AppRoutingModule } from './app-routing.module'
import { GameTemplateViewComponent } from './components/game-template-view/game-template-view.component'
import {PaginationComponent} from './components/pagination/pagination.component'
import {PlayingGameViewComponent} from './components/playing-game-view/playing-game-view.component'

@NgModule({
	declarations: [
		AppComponent,
		GameOverviewComponent,
		GameDetailComponent,
		GameCreateComponent,
		GameTemplateViewComponent,
		PlayingGameViewComponent,
		PaginationComponent,
		LoginCallbackComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpModule,
		MomentModule
	],
	providers: [ GameService, AuthService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
