import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
  });

  describe('Given the initial state', () => {
    describe('When the service starts', () => {
      it('Then it should be created', () => {
        expect(service).toBeTruthy();
      });
    });
  });
});
