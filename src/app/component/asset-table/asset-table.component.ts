import {AsyncPipe, DecimalPipe, NgIf} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {Asset} from './asset';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NgbDropdownButtonItem,
  NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle,
  NgbHighlight,
  NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from "@angular/router";
import {AssetService} from "./asset.service";

/**
 * Component for displaying a table of assets.
 */
@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.css',
  providers: [AssetService, DecimalPipe],
})
export class AssetTableComponent {
  /**
   * QueryList of sortable headers in the table.
   */
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> | undefined;

  assets$: Observable<Asset[]>;
  total$: Observable<number>;


  constructor(public service: AssetService) {
    this.assets$ = service.assets$;
    this.total$ = service.total$;
  }

  /**
   * Handles the sorting of columns in the table.
   *
   * @param column selected column.
   * @param direction asc or desc.
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    // @ts-ignore
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
