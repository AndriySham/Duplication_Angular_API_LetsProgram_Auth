import  ValidateForm  from 'src/app/helpers/validateform';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private userStore: UserStoreService){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      //console.log(this.loginForm.value);

      // Send form to database
      this.auth.login(this.loginForm.value)
        .subscribe({
          next:(res)=>{
            console.log(res.message);
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken); //Refresh Token //this.auth.storeToken(res.token); // for implement guard
            this.auth.storeRefreshToken(res.refreshToken); //Refresh Token
            const tokenPayload = this.auth.decodedToken(); // display correct username
            this.userStore.setFullNameForStore(tokenPayload.unique_name); // display correct username
            this.userStore.setRoleForStore(tokenPayload.role); // display correct role
            alert(res.message);
            this.router.navigate(['dashboard']);
          },
          error:(err)=>{
            alert(err?.error.message);
          }
        })
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid");
    }
  }
}
