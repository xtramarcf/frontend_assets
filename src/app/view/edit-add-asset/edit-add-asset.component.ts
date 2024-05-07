import {Component, OnInit} from '@angular/core';
import {Asset, defaultAsset} from "../../component/asset-table/asset";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../utility/environment";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-edit-add-asset',
  templateUrl: './edit-add-asset.component.html',
  styleUrl: './edit-add-asset.component.css'
})
export class EditAddAssetComponent implements OnInit {

  asset = defaultAsset;

  itemTypes = ['CONTRACT', 'DEVICE', 'FURNISHINGS', 'LICENSE', 'VEHICLE'];
  paymentType = ['MONTHLY', 'YEARLY', 'PURCHASED', 'FREE'];

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (history.state.id !== undefined) {
      this.asset = history.state
    } else {
      this.asset = defaultAsset
    }

  }

  onSubmit() {

    console.log(this.asset)
    this.http.post(`${this.baseUrl}/asset/save`, this.asset).subscribe({
      next: () => {
        this.router.navigate(["/home"])
      }
    })
  }
}
