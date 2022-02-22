import { RegisterControlItem, PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MicroserviceTable } from './../model/table/microservice-table';
import { MicroserviceOverviewService } from './../services/microservice-overview.service';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { SentinelBaseDirective, OffsetPaginationEvent } from '@sentinel/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { SentinelTable, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
import { SentinelControlItem } from '@sentinel/components/controls';
import { take, takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'kypo-microservice-overview',
  templateUrl: './microservice-overview.component.html',
  styleUrls: ['./microservice-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceOverviewComponent extends SentinelBaseDirective implements OnInit {
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

  constructor(private microserviceService: MicroserviceOverviewService, private paginationService: PaginationService) {
    super();
  }

  ngOnInit(): void {
    const initialLoadEvent: TableLoadEvent = {
      pagination: new OffsetPaginationEvent(
        0,
        this.paginationService.getPagination(),
        this.INIT_SORT_NAME,
        this.INIT_SORT_DIR
      ),
    };
    this.microservices$ = this.microserviceService.resource$.pipe(
      map((microservices) => new MicroserviceTable(microservices))
    );
    this.microservicesHasError$ = this.microserviceService.hasError$;
    this.microserviceService.selected$.pipe(takeWhile(() => this.isAlive)).subscribe(() => this.initControls());
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
    this.paginationService.setPagination(event.pagination.size);
    this.microserviceService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile(() => this.isAlive))
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
        defer(() => this.microserviceService.register())
      ),
    ];
  }
}
