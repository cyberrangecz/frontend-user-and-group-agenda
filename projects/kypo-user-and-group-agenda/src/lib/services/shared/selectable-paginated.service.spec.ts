import { skip, take } from 'rxjs/operators';
import { SelectablePaginatedService } from './selectable-paginated.service';

class TestSelectablePaginatedService<T> extends SelectablePaginatedService<T> {
  constructor() {
    super(10);
  }
}

describe('SelectablePaginatedService', () => {
  let service: SelectablePaginatedService<any>;

  beforeEach(() => {
    service = new TestSelectablePaginatedService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should emit on select', (done) => {
    const resources = [{ id: 1 }, { id: 2 }];
    service.selected$.pipe(skip(1), take(1)).subscribe(
      (selection) => {
        expect(selection).toEqual(resources);
        done();
      },
      (_) => fail()
    );
    service.setSelection(resources);
  });

  it('should emit on clear selection', (done) => {
    service.selected$.pipe(skip(1), take(1)).subscribe(
      (selection) => {
        expect(selection).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelection();
  });

  it('should emit correct values on multiple operations', (done) => {
    let index = 0;
    const firstSelection = [{ id: 1 }, { id: 2 }];
    const secondSelection = [{ id: 3 }, { id: 4 }, { id: 5 }];
    const thirdSelection = [];
    const expectedSelections = [firstSelection, secondSelection, thirdSelection];

    service.selected$.pipe(skip(1), take(3)).subscribe(
      (selection) => {
        expect(selection).toEqual(expectedSelections[index]);
        index++;
        if (index === expectedSelections.length) {
          done();
        }
      },
      (_) => fail()
    );
    service.setSelection(firstSelection);
    service.setSelection(secondSelection);
    service.clearSelection();
  });
});
