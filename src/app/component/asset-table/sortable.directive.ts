import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {Asset} from './asset';

export type SortColumn = keyof Asset | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {asc: 'desc', desc: '', '': 'asc'};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

/**
 * Directive to handle sortable table headers.
 */
@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  /**
   * Rotates the sort direction and emits the sort event.
   */
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
