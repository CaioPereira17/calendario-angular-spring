import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  /**
   * Determines whether the route can be activated.
   * If the user is already authenticated (has a token), they will be redirected to the home page,
   * and access to the login screen will be denied.
   * If the user is not authenticated, access to the route will be allowed.
   *
   * @returns {boolean} - Returns false if the user is authenticated, true otherwise.
   */

  canActivate(): boolean {
    if (this.loginService.hasToken()) {
      this.router.navigate(['/pessoas']); // Redireciona se já estiver autenticado
      return false; // Impede o acesso à tela de login
    }
    return true; // Permite o acesso se não estiver autenticado
  }
}
