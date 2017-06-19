import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GameOverviewComponent, GameDetailComponent, GameCreateComponent, LoginCallbackComponent, LoggedOutComponent } from './components'
import { CanActivateViaAuth } from './guards/can-activate-auth.guard'

const routes: Routes = [
	{ path: 'logged-out', component: LoggedOutComponent },
	{ path: 'games/:page', component: GameOverviewComponent, canActivate: [ CanActivateViaAuth ] },
	{ path: 'create-game', component: GameCreateComponent, canActivate: [ CanActivateViaAuth ] },
	{ path: 'game/:id', component: GameDetailComponent, canActivate: [ CanActivateViaAuth ] },
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
