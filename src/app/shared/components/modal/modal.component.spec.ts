import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Given the modal is loaded', () => {
    describe('When the title is set', () => {
      it('Then it should display the correct title', () => {
        const testTitle = 'Test Modal Title';
        component.title = testTitle;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h2')?.textContent).toContain(testTitle);
      });
    });

    describe('When the user clicks close', () => {
      it('Then it should emit the close event', () => {
        const emitSpy = spyOn(component.close, 'emit');
        component.onClose();
        expect(emitSpy).toHaveBeenCalled();
      });
    });
  });
});
