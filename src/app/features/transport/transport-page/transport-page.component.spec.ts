import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TransportPageComponent } from './transport-page.component';

describe('TransportPageComponent', () => {
  let component: TransportPageComponent;
  let fixture: ComponentFixture<TransportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransportPageComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TransportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Given the TransportPageComponent is loaded', () => {
    describe('When the component is created', () => {
      it('Then it should be truthy', () => {
        expect(component).toBeTruthy();
      });
    });
  });
});
