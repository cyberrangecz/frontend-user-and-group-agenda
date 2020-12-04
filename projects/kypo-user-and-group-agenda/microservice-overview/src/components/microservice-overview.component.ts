import { RegisterControlItem, UserAndGroupContext } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MicroserviceTable } from './../model/table/microservice-table';
import { MicroserviceOverviewService } from './../services/microservice-overview.service';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { SentinelBaseDirective, RequestedPagination } from '@sentinel/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
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

  constructor(private microserviceService: MicroserviceOverviewService, private configService: UserAndGroupContext) {
    super();
  }

  ngOnInit() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(
        0,
        this.configService.config.defaultPaginationSize,
        this.INIT_SORT_NAME,
        this.INIT_SORT_DIR
      )
    );
    this.microservices$ = this.microserviceService.resource$.pipe(
      map((microservices) => new MicroserviceTable(microservices, this.microserviceService))
    );
    this.microservicesHasError$ = this.microserviceService.hasError$;
    this.microserviceService.selected$.pipe(takeWhile((_) => this.isAlive)).subscribe(() => this.initControls());
    this.onLoadTableEvent(initialLoadEvent);
  }

  onControlsAction(controlItem: SentinelControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Clears selected microservices and calls service to get new data for microservices table
   * @param event event emitted from table component
   */
  onLoadTableEvent(event: LoadTableEvent) {
    this.microserviceService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<Microservice>) {
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
