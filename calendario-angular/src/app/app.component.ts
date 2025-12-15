//Possível versão final teste
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'; // <--- 1. Importe NavigationEnd

// --- Angular Material ---
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// --- Componentes e Serviços Locais ---
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component';
import { LoginService } from './login/auth/login.service';
import { ConfimationDialogComponent } from './shared/components/error-dialog/confimation-dialog/confimation-dialog.component';
import { PessoasService } from './pessoas/services/pessoas.service';

// --- Bibliotecas de Terceiros ---
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbar,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CustomSidenavComponent,
    MatTooltipModule,
  ],
})
export class AppComponent implements OnInit {
  
  // === Propriedades ===
  title = 'calendario-angular';
  isLoggedIn: boolean = false;
  opened = false;
  private readonly TOKEN_KEY = 'auth-token';
  mostrarBotaoLogin: boolean = true; // Variável para controlar o botão

  // === Construtor ===
  constructor(
    private router: Router,
    public loginService: LoginService,
    private dialog: MatDialog,
    private pessoaService: PessoasService,
    private cdRef: ChangeDetectorRef 
  ) {
    // <--- 2. Monitoramento de Rota Adicionado ---
    // Toda vez que a rota mudar, verificamos se o botão deve aparecer
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verificarVisibilidadeBotao(event.url);
      }
    });
  }
  //  Função para verificar se o botão deve ser mostrado CABO CAIO
  // <--- 3. Lógica para esconder o botão ---
  verificarVisibilidadeBotao(url: string) {
    // Lista de rotas onde o botão NÃO deve aparecer
    const rotasBloqueadas = [
      '/pessoas',
      '/videoConferencias/new', 
      '/auditorios/new'
    ];

    // Verifica se a URL atual está na lista de bloqueados
    // O .includes ajuda caso a URL venha com parâmetros extras
    if (rotasBloqueadas.includes(url)) {
      this.mostrarBotaoLogin = false;
      // console.log('Escondendo o botão de login na rota:', url);
    } else {
      this.mostrarBotaoLogin = true;
      // console.log('Mostrando o botão de login na rota:', url);
    }
  }

  // === Ciclo de Vida ===
  ngOnInit(): void {
    // Monitora o estado do login
    this.loginService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.cdRef.detectChanges();
    });

    // console.log('Available Routes:', this.router.config);
  }

  // === Métodos de Autenticação ===
  
  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      width: '350px',
      data: 'Você tem certeza que deseja sair?',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.loginService.logout();
          this.router.navigate(['/']);
        }, 0);
      }
    });
  }

  // === Métodos Auxiliares e Navegação ===

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  logNavigation(route: string): void {
    // console.log('Navigating to:', route);
  }

  onResizeEnd(event: ResizeEvent): void {
    // console.log('Resize event:', event);
  }
}