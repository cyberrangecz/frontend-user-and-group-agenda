/**
 * Event emitted when resource is saved
 */
export class ResourceSavedEvent {
  id: number;
  editMode: boolean;

  constructor(id: number, editMode: boolean) {
    this.id = id;
    this.editMode = editMode;
  }
}
