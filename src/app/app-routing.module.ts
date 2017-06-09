import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GameOverviewComponent, GameDetailComponent, GameCreateComponent, LoginCallbackComponent } from './components'

const routes: Routes = [
	{ path: 'games/:page', component: GameOverviewComponent },
	{ path: 'create-game', component: GameCreateComponent },
	{ path: 'game/:id', component: GameDetailComponent },
	{ path: 'callback', component: LoginCallbackComponent },
	{ path: 'games',   redirectTo: '/games/1;state=open', pathMatch: 'full' },
	{ path: '',   redirectTo: '/games/1;state=open', pathMatch: 'full' },
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
