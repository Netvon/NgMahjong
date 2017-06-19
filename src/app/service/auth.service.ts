import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { StorageService } from '../service/storage.service'

@Injectable()
export class AuthService {

	constructor(private storage: StorageService) { }

	get username() {
		return this.storage.get('username')
	}

	get token() {
		return this.storage.get('token')
	}

	set username(value: string) {
		this.storage.set('username', value)
	}

	set token(value: string) {
		this.storage.set('token', value)
	}

	get isLoggedIn(): boolean {
		return this.username !== null && this.token !== null
	}

	logout() {
		this.storage.remove('username')
		this.storage.remove('token')
	}

	redirectToLogin() {

		const host = window.location.host

		window.location.href = `http://mahjongmayhem.herokuapp.com/auth/avans?callbackUrl=http://${host}/callback`
	}
}
