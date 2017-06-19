import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../service'

@Component({
	selector: 'app-login-callback',
	templateUrl: './login-callback.component.html',
	styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			const username = params['username']
			const token = params['token']

			if ( token && token ) {
				this.authService.token = token
				this.authService.username = username
			}

			this.router.navigate([ '/' ])
		})
	}

}
