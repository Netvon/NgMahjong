import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class AuthService {

	get username() {
		return localStorage.getItem('username')
	}

	get token() {
		return localStorage.getItem('token')
	}

	set username(value: string) {
		localStorage.setItem('username', value)
	}

	set token(value: string) {
		localStorage.setItem('token', value)
	}

	get isLoggedIn(): boolean {
		return this.username !== null && this.token !== null
	}

	redirectToLogin() {

		const host = window.location.host

		window.location.href = `http://mahjongmayhem.herokuapp.com/auth/avans?callbackUrl=http://${host}/callback`
	}
}
