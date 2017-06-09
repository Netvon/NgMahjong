import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'app/service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Webs 6'

	constructor(
		private router: Router,
		public authService: AuthService,
	) { }

	isActive(route: string, parameters: any[]): boolean {

		let activeRoute = '(' + route + ')' + '.*('
		for (const key in parameters) {
			activeRoute += ';' + key + '=' + parameters[key]
		}
		activeRoute += ')'

		const re = new RegExp(activeRoute)

		return re.test(this.router.url)
	}

	doAuth() {
		this.authService.redirectToLogin()
	}
}
