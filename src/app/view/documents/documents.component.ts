import {Component, OnInit} from '@angular/core';
import {defaultAsset, Document} from "../../component/asset-table/asset";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../utility/environment";

/**
 * Component for handling the documents of assets.
 */
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent implements OnInit {

  file: File | null = null
  baseUrl = environment.baseUrl
  asset = defaultAsset

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * On init sets the selected asset to the asset var.
   */
  ngOnInit() {
    if (history.state.id !== undefined) {
      this.asset = history.state
    }
  }

  /**
   * Loads the documents by asset id.
   */
  loadDocuments() {

    const params = new HttpParams()
      .set('id', this.asset.id!)

    this.http.get<Document[]>(`${this.baseUrl}/asset/load-documents`, {params: params}).subscribe({
      next: value => {
        this.asset.docs = value
      }
    })
  }

  /**
   * Sets the selected file to the file var.
   * @param event includes the selected file.
   */
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }


  /**
   * Uploads the selected file.
   */
  uploadDocuments() {

    if (this.file === null) return

    const formData = new FormData()
    formData.append('file', this.file);

    const params = new HttpParams()
      .set('id', this.asset.id!)
    this.http.post(`${this.baseUrl}/asset/upload-document`, formData, {params}).subscribe({
      next: () => this.loadDocuments()
    })
  }


  /**
   * Opens a document in a new browser tab. Revokes the built url after using.
   * @param doc the selected document.
   */
  openDocument(doc: Document) {

    const blob = new Blob([this.base64ToUint8Array(doc.content)], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(blob);

    window.open(url, '_blank');

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  }


  /**
   * Converting file content from base64String to Uint8Array. This is needed for displaying the file in the browser.
   * @param base64String content of the file.
   */
  base64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }


  /**
   * Deletes a document.
   * @param doc the document, which will be deleted.
   */
  deleteDocument(doc: Document) {
    const params = new HttpParams()
      .set('assetId', this.asset.id!)
      .set('docId', doc.id)
    this.http.delete<any>(`${this.baseUrl}/asset/delete-document`, {params: params}).subscribe({
      next: () => this.loadDocuments()
    })
  }


}
