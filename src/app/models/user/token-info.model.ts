export class TokenInfo {
	username: string
	token: string


	toHeaders() {
		return {
			'x-username': this.username,
			'x-token': this.token
		}
	}
}
