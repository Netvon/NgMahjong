import { NgMahjongPage } from './app.po'

describe('ng-mahjong App', () => {
	let page: NgMahjongPage

	beforeEach(() => {
		page = new NgMahjongPage()
	})

	it('should display message saying that you are logged out', () => {
		page.navigateTo()
		expect(page.getParagraphText()).toEqual('Your are logged out, please login to continue.')
		expect(page.isLoggedIn).toBeTruthy()
	})

	it('should be logged in when localStorage items are present', async () => {
		await page.navigateWithLogin()

		expect(page.isLoggedIn).toBeFalsy()
	})
})
