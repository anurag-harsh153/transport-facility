import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';
import { SharedModule } from './shared/shared-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_CONFIG } from './core/tokens/app-config.token';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule],
      declarations: [App],
      providers: [
        { provide: APP_CONFIG, useValue: { apiBaseUrl: 'api' } }
      ]
    }).compileComponents();
  });

  describe('Given the application starts', () => {
    describe('When the App component is created', () => {
      it('Then it should be truthy', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      });

      it(`Then it should have the 'transport-facility' title`, () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app['title']()).toEqual('transport-facility');
      });
    });
  });
});
