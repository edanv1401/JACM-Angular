import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from 'ngx-toastr';
import {Observable, Subscription} from "rxjs";
import {IEmmitFiles} from "../Interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Request} from "../../service/request";
import {BlockUI, NgBlockUI} from "ng-block-ui";

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})


export class FacturasComponent implements OnInit, OnDestroy {
  dynamicArrayInovice: Array<FormGroup>;
  files: Array<any>;
  @Output() newItemEvent = new EventEmitter<IEmmitFiles>();
  // @ts-ignore
  @Input() events: Observable<void>;
  rd: boolean;
  // @ts-ignore
  private eventsSubscription: Subscription;
  // @ts-ignore
  @BlockUI() blockUI: NgBlockUI;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private requestService: Request) {
    this.dynamicArrayInovice = [new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      iva: new FormControl('', [Validators.required]),
      invoice: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      fileId: new FormControl(''),
      vendorId: new FormControl(''),
    })];
    this.files = [];
    this.rd = false;
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() => this.emit());
    this.route.queryParams
      .subscribe(params => {
        if (params['q'] !== undefined) {
          this.blockUI.start();
          this.requestService.getRequest(params['q'], 1).subscribe((response) => {
            if (response !== undefined) {
              if (Object.keys(response).length) {
                this.rd = !response.valid;
                for (let i = 1; i < response.vendors.length; i++) {
                  this.addRow();
                }
                for (let i = 0; i < response.vendors.length; i++) {
                  const controls = this.dynamicArrayInovice[i];
                  controls.get('iva')?.setValue(response.vendors[i].iva);
                  controls.get('name')?.setValue(response.vendors[i].name);
                  controls.get('amount')?.setValue(response.vendors[i].amount);
                  controls.get('fileId')?.setValue(response.vendors[i].fileId);
                  controls.get('invoice')?.setValue(response.vendors[i].invoice);
                  controls.get('id')?.setValue(response.vendors[i].identification);
                  controls.get('fileName')?.setValue(response.vendors[i].fileName);
                  controls.get('vendorId')?.setValue(response.vendors[i].vendorId);
                }
              }
            }
            this.blockUI.stop();
          });
        }
      });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }


  deleteRow(index: number) {
    if (this.dynamicArrayInovice.length === 1) {
      this.toastr.warning('No se pueden eliminar todas las pruebas', 'Advertencia!');
      return;
    }
    this.dynamicArrayInovice.splice(index, 1);
    this.files.splice(index, 1);
  }

  addRow() {
    if (this.dynamicArrayInovice.length === 10) {
      this.toastr.warning('Supero el limite de pruebas', 'Advertencia!');
      return;
    }
    this.dynamicArrayInovice.push(new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      iva: new FormControl('', [Validators.required]),
      invoice: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      fileId: new FormControl(''),
      vendorId: new FormControl(''),
    }));
    this.files.push([]);
  }

  onEvent(event: Event, fileInput: any): boolean {
    event.stopPropagation();
    fileInput.click();
    return false;
  }

  verifyFile(event: any, idx: number) {
    this.files[idx] = (event?.target?.files ?? '');
    this.dynamicArrayInovice[idx].get('fileName')?.setValue((event.target?.files[0]?.name ?? ''));
  }

  emit() {
    let validado = true;
    this.dynamicArrayInovice.forEach((e: FormGroup) => {
      Object.keys(e.controls).forEach(field => {
        validado &&= (e.valid);
        for (let i in e.controls) {
          e.controls[i].markAsTouched()
        }
      });
    });
    const response: IEmmitFiles = {
      data: this.dynamicArrayInovice,
      files: this.files,
      valid: validado,
    };
    this.newItemEvent.emit(response);
  }

  downloadFile(idx: number) {
    const codFile = this.dynamicArrayInovice[idx].get('fileId')?.value;
    this.requestService.downloadFile(codFile);
  }

}
