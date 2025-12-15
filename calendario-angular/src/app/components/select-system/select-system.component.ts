import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { LoginService } from '../../login/auth/login.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-select-system',
  templateUrl: './select-system.component.html',
  styleUrl: './select-system.component.scss',
  standalone: true,
    imports: [ MatCardModule, MatButton]
})
export class SelectSystemComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService

  ) {}

  ngOnInit(): void {
    // Remove o token e define o estado de login como deslogado
    this.loginService.removerToken();
  }
//http://localhost:4200/sisgepess/login
  navigateTo(system: string): void {
    if (system === 'sisgepess') {
      this.router.navigate(['/sisgepess/login']);
    } else if (system === 'sisagenda') {
      this.router.navigate(['/auditorios/new']);
    } else if (system === 'administrador') {
      this.router.navigate(['/administrador/login']);
    } else if (system === 'pessoas'){
      this.router.navigate(['/pessoas/']);
    } else if (system === 'videocon'){
      this.router.navigate(['/videoConferencias/new/']);
    }
  }
}
