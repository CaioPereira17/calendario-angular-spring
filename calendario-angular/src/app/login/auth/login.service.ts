import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomJwtPayload } from './customjwtpayload';
import { Login } from './login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentSystem: string = '';

  private readonly TOKEN_KEY = 'token';

  // BehaviorSubject para acompanhar o estado do login
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  http = inject(HttpClient);
  API = "http://localhost:8080/api/login";


  constructor(private router: Router) { }


  logar(login: Login): Observable<string> {
    return this.http.post<string>(this.API, login, {responseType: 'text' as 'json'});
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remova o token ou outros dados de sessão
    const system = this.getCurrentSystem();
    if (system === 'SISGEPESS') {
      this.router.navigate(['/sisgepess/login']);
    } else if (system === 'SISAGENDA') {
      this.router.navigate(['/sisagenda/login']);
    } else if (system === 'ADMINISTRADOR') {
      this.router.navigate(['/administrador/login']);
    } else {
      this.router.navigate(['/']); // Caso o sistema não seja reconhecido
    }
  }

  setCurrentSystem(system: string): void {
    this.currentSystem = system;
  }

  getCurrentSystem(): string {
    return this.currentSystem;
  }

  //Adiciona token
  // addToken(token: string) {
  //   localStorage.setItem(this.TOKEN_KEY, token);
  //   this.loggedInSubject.next(true); // Notifica que o usuário está logado
  // }

  addToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true); // Notifica que o usuário está logado
  }

   // Remove token
  //  removerToken() {
  //   localStorage.removeItem(this.TOKEN_KEY);
  //   this.loggedInSubject.next(false); // Notifica que o usuário não está logado
  // }

  removerToken() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false); // Notifica que o usuário não está logado
  }

  getToken() {
    return localStorage.getItem('token');
  }

  jwtDecode() {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return jwtDecode<CustomJwtPayload>(token);
    }
    return null;
  }



  // jwtDecode() {
  //   let token = this.getToken();
  //   if (token) {
  //     return jwtDecode<JwtPayload>(token);
  //   }
  //   return "";
  // }

  hasPermission(role: string): boolean {
  const payload = this.jwtDecode(); // Decodifica o token JWT
  if (payload && payload['role']) { // Supondo que "role" está no payload
    //Anotação Caio remover.
    //console.log(role);
    //console.log(payload);
    return payload['role'] === role;
  }
  return false;
}

getCurrentUser(): CustomJwtPayload | null {
  const token = this.getToken();
  if (token) {
      return this.jwtDecode();
  }
  return null;
}


  // hasPermission(role: string) {
  //   let user = this.jwtDecode() as Usuario;
  //   if (user.role == role)
  //     return true;
  //   else
  //     return false;
  // }

  // Verifica se há token armazenado
  hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }


}
