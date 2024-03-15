import {FormGroup} from "@angular/forms";

export interface IEmmitFiles {
  valid: boolean;
  data: Array<FormGroup>;
  files: Array<any>;
}

export interface IAlterts {
  factura: string;
  message: string;
  type: string;
}

export interface ICurrency {
  id: number;
  name: string;
  symbol: string;
  base: string;
}

export interface IUsuario {
  codPerfil: number;
  name: string;
}

export interface IClient {
  id: number;
  name: string;
  nit: string;
  email: string;
  dateCreate: string;
}

export interface Ivendor {

}

export interface ILogin {
  user: string;
  password: string;
}

export interface IRequest {
  invoice: string;
  message: string;
  requestId: string;
}
