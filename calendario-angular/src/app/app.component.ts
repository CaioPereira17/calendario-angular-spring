import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { PessoasService } from './pessoas/services/pessoas.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component';
import { LoginService } from './login/auth/login.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-root',
  // template: '<ejs-schedule></ejs-schedule>',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CustomSidenavComponent,
    CommonModule,
    MatTooltipModule,
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;

  title = 'calendario-angular';
  opened = false;

  logNavigation(route: string): void {
    console.log('Navigating to:', route);
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Resize event:', event);
  }

  constructor(
    private pessoaService: PessoasService,
    private router: Router,
    public loginService: LoginService
  ) {}

  private readonly TOKEN_KEY = 'auth-token';

  // Retorna o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
  ngOnInit(): void {
    // Monitora o estado do login
    this.loginService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    console.log('Available Routes:', this.router.config);
  }

  // Método de logout
  logout() {
    this.loginService.logout();
    window.location.reload();
  }

  login() {
    this.router.navigate([`/`]);
  }
}
