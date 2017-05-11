import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GameOverviewComponent, GameDetailComponent, GameCreateComponent } from './components'

const routes: Routes = [
	// { path: 'opengames/:page', component: GameOverviewComponent },
	// { path: 'playinggames/:page', component: GameOverviewComponent },
	{ path: 'games/:page', component: GameOverviewComponent },
	{ path: 'create-game', component: GameCreateComponent },
	{ path: 'game/:id', component: GameDetailComponent },
	// { path: 'opengames',   redirectTo: '/opengames/1', pathMatch: 'full' },
	{ path: 'games',   redirectTo: '/games/1', pathMatch: 'full' },
	{ path: '',   redirectTo: '/games/1', pathMatch: 'full' },
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {}
