import { browser, element, by } from 'protractor'

export class NgMahjongPage {
	navigateTo() {
		return browser.get('/')
	}

	clickLogin() {
		return browser.actions().click(element(by.css('#login'))).perform()
	}

	getParagraphText() {
		return element(by.css('.logged-out')).getText()
	}

	get isLoggedIn() {
		return element(by.css('.logged-out')) === null
	}

	async navigateWithLogin() {
		await browser.executeScript('window.localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.dUJSESU41icAYhvVnFgvlTrpl4-D2WTTsV3i_1FuZk8");')
		await browser.executeScript('window.localStorage.setItem("username", "tme.vannimwegen@student.avans.nl");')

		return browser.get('/')
	}
}
