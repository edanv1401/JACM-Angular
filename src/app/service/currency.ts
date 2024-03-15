import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {IClient, ICurrency} from "../component/Interface";
import {Login} from "./login";

@Injectable({
  providedIn: 'root'
})

export class Currency {
  constructor(
    private http: HttpClient,
    private loginService: Login
  ) {
  }

  getAllCurrencies(): Observable<ICurrency[]> {
    return this.http.get<ICurrency[]>(`${environment.apiUrl}currency`, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }
}
