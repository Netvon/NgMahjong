import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { GameOverviewComponent } from './components'

const routes: Routes = [
	{ path: 'games', component: GameOverviewComponent },
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
