import {Component, OnInit} from '@angular/core';
import {defaultAsset} from "../../component/asset-table/asset";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../utility/environment";

/**
 * Component for editing or adding assets.
 */
@Component({
  selector: 'app-edit-add-asset',
  templateUrl: './edit-add-asset.component.html',
  styleUrl: './edit-add-asset.component.css'
})
export class EditAddAssetComponent implements OnInit {

  asset = defaultAsset;

  itemTypes = ['CONTRACT', 'DEVICE', 'FURNISHINGS', 'LICENSE', 'VEHICLE'];
  paymentType = ['MONTHLY', 'YEARLY', 'PURCHASED', 'FREE'];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  /**
   * On initialization sets the selected asset.
   */
  ngOnInit() {
    if (history.state.id !== undefined) {
      this.asset = history.state
    } else {
      this.asset = defaultAsset
    }

  }

  /**
   * On submit the asset will be saved and the user will be navigated to the main view.
   */
  onSubmit() {
    this.http.post(`${environment.baseUrl}/asset/save`, this.asset).subscribe({
      next: () => {
        this.router.navigate(["/home"])
      }
    })
  }
}
