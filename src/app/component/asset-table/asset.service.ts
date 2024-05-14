import {Injectable} from '@angular/core';
import {Asset} from "./asset";
import {environment} from "../../utility/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {SortColumn, SortDirection} from "./sortable.directive";
import {tap} from "rxjs/operators";

/**
 * Defines a searchResult with an array of assets and the number of the found assets
 */
interface SearchResult {
  assets: Asset[];
  total: number;
}


/**
 * State of the asset table.
 */
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

/**
 * Compares two values.
 * @param {string|number} v1 The first value.
 * @param {string|number} v2 The second value.
 * @returns {number} Returns -1 if v1 is less than v2, 1 if v1 is greater than v2, or 0 if they are equal.
 */
const compare = (v1: string | number, v2: string | number): number => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);


/**
 * Sorts an array of assets based on a specified column and direction.
 * @param {Asset[]} assets The array of assets to be sorted.
 * @param {string} column The name of the column to sort by.
 * @param {string} direction The sort direction ('asc' for ascending, 'desc' for descending).
 * @returns {Asset[]} Returns a sorted array of assets.
 */
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

/**
 * Checks if an asset matches the given search term.
 * @param {Asset} asset The asset to be checked.
 * @param {string} term The search term to match against.
 * @returns {boolean} Returns true if the asset matches the search term, otherwise false.
 */
function matches(asset: Asset, term: string): boolean {
  return (
    asset.name.toLowerCase().includes(term) ||
    asset.itemType.toLowerCase().includes(term) ||
    asset.description.toLowerCase().includes(term) ||
    asset.owner.toLowerCase().includes(term) ||
    asset.paymentType.toLowerCase().includes(term) ||
    asset.price.toString().includes(term)
  );
}


/**
 * Service responsible for managing assets.
 */
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
    // Load assets initially
    this.loadAssets()

    // Subscribe to search event and perform search operations
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

    // Trigger initial search
    this._search$.next();
  }

  /**
   * Observable for assets.
   */
  get assets$() {
    return this._assets$.asObservable();
  }

  /**
   * Observable for total number of assets.
   */
  get total$() {
    return this._total$.asObservable();
  }

  /**
   * Get current page number.
   */
  get page() {
    return this._state.page;
  }

  /**
   * Get current page size.
   */
  get pageSize() {
    return this._state.pageSize;
  }

  /**
   * Get current search term.
   */
  get searchTerm() {
    return this._state.searchTerm;
  }

  /**
   * Set current page number.
   */
  set page(page: number) {
    this._set({page});
  }

  /**
   * Set current page size.
   */
  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  /**
   * Set current search term.
   */
  set searchTerm(searchTerm: string) {
    this._set({searchTerm});
  }

  /**
   * Set current sort column.
   */
  set sortColumn(sortColumn: SortColumn) {
    this._set({sortColumn});
  }

  /**
   * Set current sort direction.
   */
  set sortDirection(sortDirection: SortDirection) {
    this._set({sortDirection});
  }

  /**
   * Updates the state with the provided patch and triggers a search.
   * @param {Partial<State>} patch Partial state to be updated.
   */
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Searches assets based on the current state.
   * @returns {Observable<SearchResult>} Observable of search result.
   */
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


  /**
   * Loads assets from the backend.
   * @returns {void}
   */
  loadAssets(): any {
    return this.http.get<Asset[]>(`${environment.baseUrl}/asset/find-all`).subscribe({
      next: response => {
        this.assets = response
      }
    });
  }


  /**
   * Deletes an asset by its ID.
   * @param {number} id The ID of the asset to be deleted.
   * @returns {void}
   */
  deleteAsset(id: number): void {
    const params = new HttpParams().set("id", id);
    this.http.delete<any>(`${environment.baseUrl}/asset/delete`, {params}).subscribe({
      next: () => {
        this.loadAssets()
        this._search$.next();
      }
    })
  }


  /**
   * Formats NgbDate object to a string.
   * @param {NgbDate} date The NgbDate object to be formatted.
   * @returns {string} Formatted date string.
   */
  formatNgbDate(date: NgbDate): string {
    if (!date) return '';
    return this.ngbDateParserFormatter.format(date);
  }
}
