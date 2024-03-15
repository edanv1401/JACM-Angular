import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {IndiceComponent} from './component/indice/indice.component';
import {AuthGuard} from './component/helpers/auth.guard';
import {LoginComponent} from "./component/login/login.component";

const routes: Routes = [
  {path: 'invoice', component: IndiceComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
