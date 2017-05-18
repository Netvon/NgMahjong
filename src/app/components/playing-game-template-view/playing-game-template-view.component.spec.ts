import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingGameTemplateViewComponent } from './playing-game-template-view.component';

describe('GameTemplateViewComponent', () => {
    let component: PlayingGameTemplateViewComponent;
    let fixture: ComponentFixture<PlayingGameTemplateViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PlayingGameTemplateViewComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayingGameTemplateViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
