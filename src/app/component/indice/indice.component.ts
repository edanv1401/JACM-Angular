import {Component, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IAlterts, ICurrency, IEmmitFiles, IRequest, IUsuario, Ivendor} from "../Interface";
import {ToastrService} from "ngx-toastr";
import {Client} from "../../service/client";
import {Currency} from "../../service/currency";
import {Request} from "../../service/request";
import {ActivatedRoute, Router} from "@angular/router";
import {Login} from "../../service/login";

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrls: ['./indice.component.scss']
})
export class IndiceComponent implements OnInit {
  // @ts-ignore
  @BlockUI() blockUI: NgBlockUI;
  eventsSubject: Subject<void> = new Subject<void>();
  filesValidate: boolean;
  formControls = new FormGroup({
    'nit': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required]),
    'invoice': new FormControl('', [Validators.required]),
    'currency': new FormControl('', [Validators.required]),
    'observation': new FormControl(''),
  });
  currencies: Array<ICurrency>;
  usuario: IUsuario;
  filesArray: Array<any>;
  alertsUser: Array<IRequest>;
  vendors: Array<Ivendor>;
  requestId: string;
  rd: boolean;
  closeRequest: boolean;
  fixRequest: boolean;

  constructor(private toastr: ToastrService,
              private clientService: Client,
              private currencyService: Currency,
              private requestService: Request,
              private router: Router,
              private accountService: Login,
              private route: ActivatedRoute) {
    this.filesValidate = false;
    this.currencies = [];
    this.filesArray = [];
    this.vendors = [];
    this.alertsUser = [];
    this.requestId = '';
    this.rd = false;
    this.closeRequest = false;
    this.fixRequest = false;
    this.usuario = {
      name: 'REV',
      codPerfil: 2,
    };
  }

  ngOnInit() {
    this.blockUI.start();
    const userLogin = this.accountService.decodeUserJwt();
    this.usuario.codPerfil = userLogin.rolId;
    this.currencyService.getAllCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      this.blockUI.stop();
    });
    if (!this.accountService.tokenExpired()) {
      this.blockUI.start();
      this.requestService.getRequestForUser().subscribe((data) => {
        this.alertsUser = data;
        this.blockUI.stop();
      });
    } else {
      this.logout();
    }
    this.route.queryParams
      .subscribe(params => {
        if (params['q'] !== undefined) {
          this.blockUI.start();
          this.requestService.getRequest(params['q'], 0).subscribe((response) => {
            if (response !== undefined) {
              if (Object.keys(response).length) {
                this.rd = true;
                this.requestId = params['q'];
                this.formControls.get('nit')?.setValue(response.nit);
                this.formControls.get('name')?.setValue(response.name);
                this.formControls.get('invoice')?.setValue(response.invoice);
                this.formControls.get('email')?.setValue(response.email);
                const currencySelected = this.currencies.filter((e) => e.id === response.currencyId)[0];
                this.formControls.get('currency')?.setValue(currencySelected.name + ' ' + currencySelected.base);
                if (response?.observation[0].observation) {
                  this.formControls.get('observation')?.setValue(response.observation[0].observation);
                  this.fixRequest = (+response.observation[0].trakingId) === 2;
                  this.formControls.get('currency')?.setValue(response.currencyId);
                  this.rd = false;
                }
                if (response?.observation.length) {
                  this.closeRequest = (+response.observation[0].trakingId) === 4;
                }
              }
            }
            this.blockUI.stop();
          });
        }
      });
  }

  addFiles(files: IEmmitFiles): void {
    this.vendors = [];
    this.filesValidate = files.valid;
    this.filesArray = files.files;
    files.data.forEach((e: FormGroup) => {
      const controls = e.controls;
      this.vendors.push({
        id: controls['id'].value,
        iva: controls['iva'].value,
        name: controls['name'].value,
        amount: controls['amount'].value,
        invoice: controls['invoice'].value,
        vendorId: controls['vendorId']?.value ?? '',
      });
    });
  }

  submitRequest(): void {
    if (!this.formControls.valid) {
      this.toastr.error('Se deben llenar los datos del cliente', 'Error');
      return;
    }
    this.emitEventToChild();
    if (this.filesValidate) {
      const controls = this.formControls.controls;
      const clienteForm = {
        nit: controls.nit.value,
        name: controls.name.value,
        email: controls.email.value,
      };
      const invoiceForm = {
        invoice: controls.invoice.value,
        currency: controls.currency.value,
      };
      const formData = new FormData();
      formData.append('client', JSON.stringify(clienteForm));
      formData.append('invoice', JSON.stringify(invoiceForm));
      formData.append('vendor', JSON.stringify(this.vendors));
      for (const file of this.filesArray) {
        formData.append('files', file[0], file[0].name);
      }
      this.requestService.postRequest(formData).subscribe((data) => {
        if (data?.request) {
          this.router.navigate([], {
            queryParams: {
              q: data.request
            },
          }).then(() => {
            window.location.reload();
          });
        }
      });
      return;
    }
    this.toastr.error('Se deben verificar los adjuntos', 'Error');
  }

  emitEventToChild(): void {
    this.eventsSubject.next();
  }

  searchClient(): void {
    if (this.formControls.get('nit')?.valid ?? false) {
      this.blockUI.start();
      const nit = this.formControls.get('nit')?.value ?? '';
      this.clientService.getClientNit(nit).subscribe((client) => {
        this.formControls.get('name')?.setValue('');
        this.formControls.get('email')?.setValue('');
        if (client && client.length) {
          this.formControls.get('name')?.setValue(client[0].name);
          this.formControls.get('email')?.setValue(client[0].email);
        }
        this.blockUI.stop();
      });
    }
  }

  addObservation() {
    const observation = {
      requestId: this.requestId,
      message: (this.formControls.get('observation')?.value ?? ''),
    };
    this.requestService.postObservation(observation).subscribe(() => {
      this.router.navigate([], {
        queryParams: {
          q: this.requestId,
        },
      }).then(() => {
        window.location.reload();
      });
    });
  }

  logout() {
    this.alertsUser = [];
    this.accountService.logout();
  }

  newRequest() {
    this.router.navigate(['/invoice']).then(() => window.location.reload());
  }

  viewRequest(requestId: string) {
    this.router.navigate([], {
      queryParams: {
        q: requestId
      },
    }).then(() => {
      window.location.reload();
    });
  }

  generateCertificate() {
    this.requestService.generateCertificate(this.requestId, this.accountService.decodeUserJwt().id);
    window.location.reload();
  }

  fixRequestTraking() {
    this.emitEventToChild();
    console.log(this.vendors);
    this.requestService.putRequest(this.requestId, this.vendors).subscribe(() => {
      window.location.reload();
    });
  }
}
