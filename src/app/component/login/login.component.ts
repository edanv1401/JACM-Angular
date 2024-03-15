import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Login} from "../../service/login";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;

  constructor(private userService: Login,
              private toastr: ToastrService,
              private router: Router,) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;
    this.userService.login(username, password).subscribe((data) => {
      if (data.login === 0) {
        this.toastr.error(data.message, 'Error');
        return;
      }
      this.router.navigate(['/invoice']);
    });
  }
}
