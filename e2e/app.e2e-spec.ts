import { NgMahjongPage } from './app.po';

describe('ng-mahjong App', () => {
  let page: NgMahjongPage;

  beforeEach(() => {
    page = new NgMahjongPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
