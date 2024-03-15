import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {IClient} from "../component/Interface";
import {Login} from "./login";

@Injectable({
  providedIn: 'root'
})

export class Client {
  constructor(
    private http: HttpClient,
    private loginService: Login
  ) {
  }

  getClientNit(nit: string): Observable<IClient[]> {
    return this.http.get<IClient[]>(`${environment.apiUrl}client/${nit}`, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }
}
