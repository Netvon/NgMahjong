import { Component } from '@angular/core'
import { Router } from "@angular/router";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Webs 6'

	constructor(
		private router: Router,
	) { }

	isActive(route: string, parameters: any[]): boolean {

		var activeRoute = "("+route+")" + ".*(";
		for (var key in parameters) {
			activeRoute += ";"+key+"="+parameters[key];
		}
		activeRoute += ")"

		var re = new RegExp(activeRoute);

		return re.test(this.router.url)
	}
}
