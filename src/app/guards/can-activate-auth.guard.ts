import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { AuthService } from './../service/auth.service'

@Injectable()
export class CanActivateViaAuth implements CanActivate {

	constructor(private authService: AuthService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		if ( this.authService.isLoggedIn ) {
			return true
		} else {
			this.router.navigate(['/logged-out'])
			return false
		}
	}
}
