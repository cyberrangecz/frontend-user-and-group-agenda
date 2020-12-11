import { SentinelTable, Column, Row } from '@sentinel/components/table';
import { PaginatedResource } from '@sentinel/common';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';

/**
 * @dynamic
 * Class creating data source for microservice-overview table
 */
export class MicroserviceTable extends SentinelTable<Microservice> {
  constructor(resource: PaginatedResource<Microservice>) {
    const rows = resource.elements.map((element) => MicroserviceTable.createRow(element));
    const columns = [
      new Column('id', 'id', false),
      new Column('name', 'name', true),
      new Column('endpoint', 'endpoint', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by name';
    this.selectable = false;
  }

  private static createRow(microservice: Microservice): Row<Microservice> {
    return new Row(microservice);
  }
}
