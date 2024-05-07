import {Injectable} from '@angular/core';
import {Asset} from "./asset";
import {environment} from "../../utility/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {SortColumn, SortDirection} from "./sortable.directive";
import {tap} from "rxjs/operators";

interface SearchResult {
  assets: Asset[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(assets: Asset[], column: SortColumn, direction: string): Asset[] {
  if (direction === '' || column === '') {
    return assets;
  } else {
    return [...assets].sort((a, b) => {
      // @ts-ignore
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(asset: Asset, term: string) {
  return (
    asset.name.toLowerCase().includes(term) ||
    asset.itemType.toLowerCase().includes(term) ||
    asset.description.toLowerCase().includes(term) ||
    asset.owner.toLowerCase().includes(term) ||
    asset.paymentType.toLowerCase().includes(term) ||
    asset.price.toString().includes(term)
  );
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assets: Asset[] = []
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _assets$ = new BehaviorSubject<Asset[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(
    private pipe: DecimalPipe,
    private http: HttpClient,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {

    this.loadAssets()

    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false)),
      )
      .subscribe((result) => {
        this._assets$.next(result.assets);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get assets$() {
    return this._assets$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({page});
  }

  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  set searchTerm(searchTerm: string) {
    this._set({searchTerm});
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({sortDirection});
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let assets = sort(this.assets, sortColumn, sortDirection);

    // 2. filter
    assets = assets.filter((country) => matches(country, searchTerm));
    const total = assets.length;

    // 3. paginate
    assets = assets.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({assets: assets, total});
  }


  loadAssets(): any {
    return this.http.get<Asset[]>(`${environment.baseUrl}/asset/find-all`).subscribe({
      next: response => {
        this.assets = response
      }
    });
  }

  deleteAsset(id: number) {
    const params = new HttpParams().set("id", id);
    this.http.delete<any>(`${environment.baseUrl}/asset/delete`, {params}).subscribe({
      next: () => {
        this.loadAssets()
      }
    })
  }


  formatNgbDate(date: NgbDate): string {
    if (!date) return '';
    return this.ngbDateParserFormatter.format(date);
  }
}
