import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

//const router = new Router();
/*export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');   
  const router = inject(Router) 

  if (token){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};*/

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);   
  const router = inject(Router) 
  if (authService.isLoggedIn()){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};