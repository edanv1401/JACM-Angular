import {Component, Input, OnInit} from '@angular/core';
import {Login} from "./service/login";
import {Request} from "./service/request";
import {IRequest} from "./component/Interface";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private accountService: Login, private requestService: Request, private router: Router) {
  }


  ngOnInit() {
  }
}
