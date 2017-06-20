import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { RouterTestingModule } from '@angular/router/testing'

import { GameDetailComponent } from './game-detail.component'

import { Observable } from 'rxjs/Observable'
import { TemplateBoard, Tile, TokenInfo, Game, GameState, UserInGame, PlayingBoard, PlayingTile, PostMatch } from 'app/models'
import { GameService, AuthService } from 'app/service'
import { GameTemplateViewComponent, PlayingGameViewComponent, LoadingIndicatorComponent } from 'app/components'
import { TileSelectablePipe } from 'app/pipes/tile-selectable.pipe'
import { TileHintablePipe } from 'app/pipes/tile-hintable.pipe'


class MockAuthService {
}
class MockGameService {
	getTemplates(): Observable<TemplateBoard[]> {
		return Observable.of([
			new TemplateBoard().fromJson({ id: 'abc', tiles: [new Tile().fromJson({ xPos: 0, yPos: 0, zPos: 0 })] }),
			new TemplateBoard().fromJson({ id: 'cba', tiles: [new Tile().fromJson({ xPos: 0, yPos: 0, zPos: 0 })] })
		])
	}

	getToken(): Observable<TokenInfo> {
		const info = new TokenInfo()
		info.token = 'abc'
		info.username = 'abc'

		return Observable.of(info)
	}

	getGame(id: string): Observable<Game> {
		return Observable.of(new Game().fromJSON({
			id,
			gameTemplate: { id: 'abc' },
			createdOn: new Date(),
			createdBy: {},
			state: GameState.playing,
			startedOn: new Date(),
			players: [],
			endedOn: null,
			maxPlayers: 1,
			minPlayers: 1,
		}))
	}

	getPlayersInGame(id: string): Observable<UserInGame[]> {
		return Observable.of([
			new UserInGame('tom', 'tomvn')
		])
	}

	getPlayingBoard(id: string) {
		return Observable.of(new PlayingBoard().fromJson([
			new PlayingTile().fromJson({
				xPos: 0,
				yPos: 0,
				zPos: 0,
				_id: id,
				tile: { id: 'hallo', suit: 'hallo', name: 'hallo', matchesWholeSuit: true }
			})
		]))
	}

	setupSocketConnection(id: string) {}

	getMatchMessages(): Observable<PostMatch> {
		return Observable.of(new PostMatch(null, '1', '2'))
	}

	getGameStatusMessages(): Observable<string> {
		return Observable.of('start')
	}

	getUsersJoiningMessages(): Observable<string> {
		return Observable.of(' ')
	}
}

describe('GameDetailComponent', () => {
	let component: GameDetailComponent
	let fixture: ComponentFixture<GameDetailComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserModule,
				FormsModule,
				HttpModule,
				RouterTestingModule.withRoutes([])
			],
			declarations: [
				PlayingGameViewComponent,
				GameTemplateViewComponent,
				GameDetailComponent,
				LoadingIndicatorComponent,
				TileSelectablePipe,
				TileHintablePipe,
			],
			providers: [
				{ provide: GameService, useClass: MockGameService },
				{ provide: AuthService, useClass: MockAuthService }
			]
		})
			.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(GameDetailComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
