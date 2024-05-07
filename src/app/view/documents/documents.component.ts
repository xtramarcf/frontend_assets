import {Component, OnInit} from '@angular/core';
import {defaultAsset, Document} from "../../component/asset-table/asset";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../utility/environment";

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


  ngOnInit() {
    if (history.state.id !== undefined) {
      this.asset = history.state
    }
  }


  loadDocuments() {

    const params = new HttpParams()
      .set('id', this.asset.id!)

    this.http.get<Document[]>(`${this.baseUrl}/asset/load-documents`, {params: params}).subscribe({
      next: value => {
        this.asset.docs = value
      }
    })
  }


  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }


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


  openDocument(doc: Document) {

    const blob = new Blob([this.base64ToUint8Array(doc.content)], {type: 'application/pdf'}); // Ändere den MIME-Typ entsprechend dem Dateityp
    const url = window.URL.createObjectURL(blob);

    // Öffne die Datei in einem neuen Tab
    window.open(url, '_blank');

    // Optional: Revokiere die URL, wenn sie nicht mehr benötigt wird, um Speicherlecks zu vermeiden
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  }


  base64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }


  deleteDocument(doc: Document) {

    const params = new HttpParams()
      .set('assetId', this.asset.id!)
      .set('docId', doc.id)
    this.http.delete<any>(`${this.baseUrl}/asset/delete-document`, {params: params}).subscribe({
      next: () => this.loadDocuments()
    })
  }


}
