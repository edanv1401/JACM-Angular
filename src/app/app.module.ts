import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FacturasComponent} from './component/facturas/facturas.component';
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {ToastrModule} from 'ngx-toastr';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatBadgeModule} from "@angular/material/badge";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {BlockUIModule} from 'ng-block-ui';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {RouterModule} from "@angular/router";
import { LoginComponent } from './component/login/login.component';
import {AppRoutingModule} from "./app-routing.module";
import { IndiceComponent } from './component/indice/indice.component';

@NgModule({
  declarations: [
    AppComponent,
    FacturasComponent,
    LoginComponent,
    IndiceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    ToastrModule.forRoot(),
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatSelectModule,
    BlockUIModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
