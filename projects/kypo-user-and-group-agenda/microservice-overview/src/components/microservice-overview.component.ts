import { RegisterControlItem, PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MicroserviceTable } from './../model/table/microservice-table';
import { MicroserviceOverviewService } from './../services/microservice-overview.service';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, Input } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { SentinelTable, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
import { SentinelControlItem } from '@sentinel/components/controls';
import { take, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'kypo-microservice-overview',
  templateUrl: './microservice-overview.component.html',
  styleUrls: ['./microservice-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceOverviewComponent implements OnInit {
  @Input() paginationId = 'kypo-microservice-overview';
  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for microservices table component
   */
  microservices$: Observable<SentinelTable<Microservice>>;

  /**
   * True if error was thrown while getting data for microservies table, false otherwise
   */
  microservicesHasError$: Observable<boolean>;

  controls: SentinelControlItem[];

  destroyRef = inject(DestroyRef);

  constructor(
    private microserviceService: MicroserviceOverviewService,
    private paginationService: PaginationService,
  ) {}

  ngOnInit(): void {
    const initialLoadEvent: TableLoadEvent = {
      pagination: new OffsetPaginationEvent(
        0,
        this.paginationService.getPagination(this.paginationId),
        this.INIT_SORT_NAME,
        this.INIT_SORT_DIR,
      ),
    };
    this.microservices$ = this.microserviceService.resource$.pipe(
      map((microservices) => new MicroserviceTable(microservices)),
    );
    this.microservicesHasError$ = this.microserviceService.hasError$;
    this.microserviceService.selected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.initControls());
    this.onTableLoadEvent(initialLoadEvent);
  }

  onControlsAction(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Clears selected microservices and calls service to get new data for microservices table
   * @param event event emitted from table component
   */
  onTableLoadEvent(event: TableLoadEvent): void {
    this.paginationService.setPagination(this.paginationId, event.pagination.size);
    this.microserviceService
      .getAll(event.pagination, event.filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Resolves type of action call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<Microservice>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  private initControls() {
    this.controls = [
      new RegisterControlItem(
        'Register',
        of(false),
        defer(() => this.microserviceService.register()),
      ),
    ];
  }
}
