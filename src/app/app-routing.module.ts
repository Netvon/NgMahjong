import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GameOverviewComponent, GameDetailComponent } from './components'

const routes: Routes = [
	{ path: 'games/:page', component: GameOverviewComponent },
	{ path: 'games',   redirectTo: '/games/1', pathMatch: 'full' },
	{ path: 'game/:id', component: GameDetailComponent },
	{ path: '',   redirectTo: '/games', pathMatch: 'full' },
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
