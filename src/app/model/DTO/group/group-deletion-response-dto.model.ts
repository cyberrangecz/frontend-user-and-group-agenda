import {MicroserviceForGroupDeletionDTO} from '../microservice/microservice-for-group-deletion-dto.model';

export class GroupDeletionResponseDTO {
  id: number;
  microservice_for_group_deletion_dtos:	MicroserviceForGroupDeletionDTO[];
  status: string;
}
