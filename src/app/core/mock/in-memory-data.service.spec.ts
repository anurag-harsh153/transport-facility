import { TestBed } from '@angular/core/testing';
import { InMemoryDataService } from './in-memory-data.service';

describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryDataService]
    });
    service = TestBed.inject(InMemoryDataService);
  });

  describe('Given the initial state', () => {
    describe('When the service starts', () => {
      it('Then it should be created', () => {
        expect(service).toBeTruthy();
      });
    });
  });
});
