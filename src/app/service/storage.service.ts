import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class StorageService {
	get(key: string) {
		return localStorage.getItem(key)
	}

	set(key: string, value: string) {
		localStorage.setItem(key, value)
	}

	remove(key: string) {
		localStorage.removeItem(key)
	}

	has(key: string) {
		return this.get(key) !== null
	}
}