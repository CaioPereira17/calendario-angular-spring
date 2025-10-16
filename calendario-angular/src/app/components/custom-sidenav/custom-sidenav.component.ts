import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Importe OnInit
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../../usuarios/containers/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../login/auth/login.service';

// O tipo MenuItem pode ser útil no futuro, vamos mantê-lo
export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
})
export class CustomSidenavComponent implements OnInit { // Implemente OnInit

  // --- Variáveis de permissão descritivas ---
  isAdmin = false;
  isAgendamento = false;
  isTi = false;
  isDivPess = false;
  isUsuario = false;


  constructor(
    private router: Router,
    private loginService: LoginService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Vamos verificar todas as permissões quando o componente iniciar
    this.checkUserPermissions();
  }

  /**
   * Verifica os perfis do usuário logado e define as variáveis de controle.
   */
  checkUserPermissions(): void {
    // Verifica se o usuário é Administrador
    this.isAdmin = this.loginService.hasPermission('ADMINISTRADOR');

    // Verifica se o usuário pode agendar (Admin OU Agendamento)
    this.isAgendamento = this.loginService.hasPermission('AGENDAMENTO');
    
    // Você pode adicionar mais verificações aqui. Exemplo:
    this.isTi = this.loginService.hasPermission('TI');

    // Divisão pessoal
    this.isDivPess = this.loginService.hasPermission('DIV_PESS');

    //Usuário

    this.isUsuario = this.loginService.hasPermission('USUARIO')
    //Anotação  Caio Remover
    //console.log('Permissões verificadas:', { isAdmin: this.isAdmin, isAgendamento: this.isAgendamento, isDivPess: this.isDivPess,  isUsuario: this.isUsuario });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result: ', result);
    });
  }
}