import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SettingsComponent} from './view/settings/settings.component';
import {RegisterComponent} from './view/register/register.component';
import {LoginComponent} from './view/login/login.component';
import {HeadnavComponent} from "./component/headnav/headnav.component";
import {AssetTableComponent} from './component/asset-table/asset-table.component';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from "@angular/common/http";
import {JwtModule} from "@auth0/angular-jwt";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FeedbackComponent} from './component/feedback/feedback.component';
import {EditAddAssetComponent} from './view/edit-add-asset/edit-add-asset.component';
import {AuthInterceptorService} from "./service/interceptor/auth-interceptor.service";
import {DocumentsComponent} from "./view/documents/documents.component";
import { AssetsComponent } from './view/assets/assets.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    RegisterComponent,
    LoginComponent,
    HeadnavComponent,
    FeedbackComponent,
    EditAddAssetComponent,
    DocumentsComponent,
    AssetsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token')
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    AssetTableComponent
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  exports: [
    HeadnavComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
