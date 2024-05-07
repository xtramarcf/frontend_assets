import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from "./view/settings/settings.component";
import {LoginComponent} from "./view/login/login.component";
import {RegisterComponent} from "./view/register/register.component";
import {EditAddAssetComponent} from "./view/edit-add-asset/edit-add-asset.component";
import {DocumentsComponent} from "./view/documents/documents.component";
import {AssetsComponent} from "./view/assets/assets.component";

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'home', component: AssetsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'edit-add', component: EditAddAssetComponent},
  {path: 'documents', component: DocumentsComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
