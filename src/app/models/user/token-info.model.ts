import { Headers } from '@angular/http'

export class TokenInfo {
	username: string
	token: string


	toHeaders(): Headers {
		return new Headers({
			'x-username': this.username,
			'x-token': this.token
		})
	}
}
