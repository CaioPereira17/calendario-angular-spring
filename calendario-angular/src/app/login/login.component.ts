// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Login } from './auth/login';
// import { LoginService } from './auth/login.service';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
//   standalone: true,
//   imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, MatCardModule]
// })
// export class LoginComponent implements OnInit {

//   siglaSistema: string = '';
//   descricaoSistema: string = '';
//   login = { username: '', password: '' };

//   // login: Login = new Login();

//   // router = inject(Router);
//   hide = true;

//   // loginService = inject(LoginService);

//   @Input() error: string | null | undefined;

//   @Output() submitEM = new EventEmitter();

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private loginService: LoginService

//   ) {
//     this.loginService.removerToken();
//   }


//   ngOnInit(): void {
//     const systemType = this.route.snapshot.url[0]?.path; // Obtém a parte da URL
//     console.log(systemType)
//     if (systemType === 'sisgepess' || systemType === 'login') {
//       this.siglaSistema = 'SISGEPESS';
//       this.descricaoSistema = 'Sistema de Gestão de Pessoal';

//     } else if (systemType === 'sisagenda') {
//       this.siglaSistema = 'SISAGENDA';
//       this.descricaoSistema = 'Sistema de Agendamento';

//     } else if (systemType === 'administrador') {
//       this.siglaSistema = 'ADMINISTRADOR';
//       this.descricaoSistema = 'Administrador do Sistema';
//     }
//     // Define o sistema atual no LoginService
//     this.loginService.setCurrentSystem(this.siglaSistema);
//   }

//   form: FormGroup = new FormGroup({
//     username: new FormControl(''),
//     password: new FormControl(''),

//   });

//   //Caio correção login
//   logar(): void {
    
//     // PASSO 1: Verificamos se a função foi chamada e quais dados ela está enviando
//     console.log('1. Tentando logar com:', this.login);

//     this.loginService.logar(this.login).subscribe({
      
//       next: token => {
//         // PASSO 2: Vemos o que o backend retornou
//         console.log('2. Resposta do backend recebida. Token:', token);

//         if (token) {
//           console.log(this.siglaSistema)
//           // PASSO 3 (Sucesso): Se o token existir, entramos aqui
//           console.log('3. Login OK. Salvando token e redirecionando...');
//           this.loginService.addToken(token);

//           // Redireciona baseado no sistema selecionado
//           if (this.siglaSistema === 'SISGEPESS' || this.siglaSistema === 'ADMINISTRADOR') {
            
//             this.router.navigate(['/pessoas']);
//           } else if (this.siglaSistema === 'SISAGENDA') {
//             this.router.navigate(['/auditorios/new']);
//           }
//         } else {
//           // PASSO 3 (Falha): O backend respondeu, mas o token é nulo
//           console.log('3. Falha no login. O backend retornou um token nulo.');
//           alert('Usuário ou senha inválidos (Token nulo)');
//         }
//       },
//       error: (err) => { // Adicionamos 'err' para ver o erro
//         // PASSO 2 (Falha): A chamada à API falhou (401, 404, 500, CORS, etc)
//         console.error('2. ERRO na chamada de login:', err);
//         alert('Usuário ou senha inválidos (Erro na API)');
//       }
//     });
//   }

//   // Método de logout
//   logout(): void {
//     this.loginService.removerToken(); // Remove o token
//   }

//   submit() {
//     if (this.form.valid) {
//       this.submitEM.emit(this.form.value);
//     }
//   }


// }
//possível versão final
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './auth/login.service'; // Removi o import 'Login' não usado
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, MatCardModule]
})
export class LoginComponent implements OnInit {

  siglaSistema: string = '';
  descricaoSistema: string = '';
  login = { username: '', password: '' };
  hide = true;

  @Input() error: string | null | undefined;
  @Output() submitEM = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginService.removerToken();
  }

  ngOnInit(): void {
    const systemType = this.route.snapshot.url[0]?.path; 
    console.log('System Type:', systemType);

    // --- CORREÇÃO NO NGONINIT ---
    // Adicionei a verificação (|| systemType === 'login')
    // Se a URL for genérica (/login), assumimos que é o SISGEPESS.
    
    if (systemType === 'sisgepess' || systemType === 'login') {
      this.siglaSistema = 'SISGEPESS';
      this.descricaoSistema = 'Sistema de Gestão de Pessoal';

    } else if (systemType === 'sisagenda') {
      this.siglaSistema = 'SISAGENDA';
      this.descricaoSistema = 'Sistema de Agendamento';

    } else if (systemType === 'administrador') {
      this.siglaSistema = 'ADMINISTRADOR';
      this.descricaoSistema = 'Administrador do Sistema';
    }
    
    // Define o sistema atual no LoginService
    this.loginService.setCurrentSystem(this.siglaSistema);
  }

  // (Seus forms e métodos antigos removidos para limpeza...)

  logar(): void {
    console.log('1. Tentando logar com:', this.login);

    this.loginService.logar(this.login).subscribe({
      
      next: token => {
        console.log('2. Resposta do backend recebida. Token:', token);

        if (token) {
          console.log('Sistema Atual:', this.siglaSistema);
          console.log('3. Login OK. Salvando token e redirecionando...');
          this.loginService.addToken(token);

          // --- CORREÇÃO NO REDIRECIONAMENTO ---
          // Adicionei um 'else' final para garantir que sempre haja navegação
          
          if (this.siglaSistema === 'SISGEPESS' || this.siglaSistema === 'ADMINISTRADOR') {
            this.router.navigate(['/pessoas']);
            
          } else if (this.siglaSistema === 'SISAGENDA') {
            this.router.navigate(['/auditorios/new']);
            
          } else {
             // Fallback: Se a sigla estiver vazia ou desconhecida, 
             // manda para a tela principal (pessoas)
             console.log('Sigla não específica, redirecionando para padrão.');
             this.router.navigate(['/pessoas']);
          }

        } else {
          console.log('3. Falha no login. O backend retornou um token nulo.');
          alert('Usuário ou senha inválidos (Token nulo)');
        }
      },
      error: (err) => { 
        console.error('2. ERRO na chamada de login:', err);
        alert('Usuário ou senha inválidos (Erro na API)');
      }
    });
  }
  
  logout(): void {
    this.loginService.removerToken(); 
  }
}