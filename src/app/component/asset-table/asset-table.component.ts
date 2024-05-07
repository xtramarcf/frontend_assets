import {AsyncPipe, DecimalPipe, NgIf} from '@angular/common';
import {Component, PipeTransform, QueryList, ViewChildren} from '@angular/core';
import {map, Observable, startWith} from 'rxjs';
import {Asset} from './asset';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle,
  NgbHighlight,
  NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../utility/environment";
import {AssetService} from "./asset.service";


@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.css',
  providers: [AssetService, DecimalPipe],
})
export class AssetTableComponent {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> | undefined;

  assets$: Observable<Asset[]>;
  total$: Observable<number>;


  constructor(public service: AssetService) {
    this.assets$ = service.assets$;
    this.total$ = service.total$;
  }

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
