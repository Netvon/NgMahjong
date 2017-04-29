import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { MomentModule } from 'angular2-moment'

import { AppComponent } from './app.component'

import { GameService } from './service/game.service'
import { GameOverviewComponent, GameDetailComponent } from './components'

import { AppRoutingModule } from './app-routing.module'

@NgModule({
	declarations: [
		AppComponent,
		GameOverviewComponent,
		GameDetailComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpModule,
		MomentModule
	],
	providers: [ GameService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
