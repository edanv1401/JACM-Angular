import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {IClient, ICurrency} from "../component/Interface";
import {Login} from "./login";

@Injectable({
  providedIn: 'root'
})

export class Request {
  constructor(
    private http: HttpClient,
    private loginService: Login
  ) {
  }

  postRequest(body: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}request`, body, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }

  getRequest(id: string, vendors: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}request/${id}?v=${vendors}`, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }

  downloadFile(id: string) {
    window.open(`${environment.apiUrl}request/file/${id}`);
  }

  getRequestForUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}request`, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }

  postObservation(body: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}request/observation`, body, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }

  generateCertificate(requestId: string, userId: string) {
    window.open(`${environment.apiUrl}request/generate-pdf/${requestId}?user=${userId}`);
  }

  putRequest(id: string,body: any): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}request/${id}`, body, {
      headers: {
        'Authorization': `Bearer ${this.loginService.userValue}`
      }
    });
  }
}
