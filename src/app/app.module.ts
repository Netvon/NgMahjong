import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component'

import { GameService } from './service/game.service'
import { GameOverviewComponent } from './components'

import { Angular2FontAwesomeModule } from 'angular2-font-awesome/angular2-font-awesome'
import { AppRoutingModule } from './app-routing.module'

@NgModule({
	declarations: [
		AppComponent,
		GameOverviewComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpModule,
		Angular2FontAwesomeModule
	],
	providers: [ GameService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
