import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { MomentModule } from 'angular2-moment'

import { AppComponent } from './app.component'

import { GameService, AuthService, StorageService, ScrollService } from './service'
import {
	GameOverviewComponent,
	GameDetailComponent,
	GameCreateComponent,
	LoginCallbackComponent,
	LoggedOutComponent,
	LoadingIndicatorComponent } from './components'

import { AppRoutingModule } from './app-routing.module'
import { GameTemplateViewComponent } from './components/game-template-view/game-template-view.component'
import { PaginationComponent } from './components/pagination/pagination.component'
import { PlayingGameViewComponent } from './components/playing-game-view/playing-game-view.component'
import { CanActivateViaAuth } from './guards/can-activate-auth.guard'
import { TileSelectablePipe } from './pipes/tile-selectable.pipe'
import { TileHintablePipe } from './pipes/tile-hintable.pipe'

@NgModule({
	declarations: [
		AppComponent,
		GameOverviewComponent,
		GameDetailComponent,
		GameCreateComponent,
		GameTemplateViewComponent,
		PlayingGameViewComponent,
		PaginationComponent,
		LoginCallbackComponent,
		LoggedOutComponent,
		TileSelectablePipe,
		TileHintablePipe,
		LoadingIndicatorComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpModule,
		MomentModule
	],
	providers: [ CanActivateViaAuth, StorageService, GameService, AuthService, ScrollService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
