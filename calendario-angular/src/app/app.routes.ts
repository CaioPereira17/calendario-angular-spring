import { ChangePasswordComponent } from './usuarios/containers/change-password/change-password.component';
import { Routes } from '@angular/router';
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component';
import { LoginComponent } from './login/login.component';
import { PessoasInativasComponent } from './pessoas/components/pessoas-inativas/pessoas-inativas.component';
import { UsuariosComponent } from './usuarios/containers/usuarios/usuarios.component';
import { SelectSystemComponent } from './components/select-system/select-system.component';
import { AuthGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  // { path: '', component: LoginComponent }, // Define LoginComponent como página inicial

  // { path: '', pathMatch: 'full', redirectTo: 'pessoas' }, // Redireciona para "pessoas"

  { path: '', component: SelectSystemComponent },
  { path: 'sisgepess/login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'sisagenda/login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'administrador/login', component: LoginComponent, canActivate: [AuthGuard] },



  {
    path: 'pessoas',
    loadChildren: () =>
      import('./pessoas/pessoas.routes').then((m) => m.PESSOAS_ROUTES),
  },

  {
    path: 'assessorias',
    loadChildren: () =>
      import('./assessorias/assessorias.routes').then((m) => m.ASSESSORIAS_ROUTES),
  },

  {
    path: 'agendamentos',
    loadChildren: () =>
      import('./agendamentos/agendamentos.routes').then((m) => m.AGENDAMENTOS_ROUTES),
  },

  {
    path: 'auditorios',
    loadChildren: () =>
      import('./auditorios/auditorios.routes').then((m) => m.AUDITORIOS_ROUTES),
  },
  {
    path: 'videoConferencias',
    loadChildren: () =>
      import('./videoConferencias/videoConferencias.routes').then((m) => m.VIDEOCONFERENCIAS_ROUTES,
      ),
  },

  {
    path: 'custom-sidenav',
    loadChildren: () =>
      import('./components/custom-sidenav/custom-sidenav.routes').then((m) => m.CUSTOMSIDENAV_ROUTES,
      ),
    component: CustomSidenavComponent, // Use o componente standalone
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.routes').then((m) => m.LOGIN_ROUTES,
      ),
    component: LoginComponent, // Use o componente standalone
  },

  {
  path: 'inativas',
    loadChildren: () =>
      import('./pessoas/pessoas.routes').then((m) => m.PESSOAS_ROUTES,
      ),
    component: PessoasInativasComponent, // Use o componente standalone
  },

  {
    path: 'usuarios',
      loadChildren: () =>
        import('./usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES,
        ),

    },

    {
    path: 'inativos',
      loadChildren: () =>
        import('./usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES,
        ),

    },

    {
      path: 'alterar-senha',
        loadChildren: () =>
          import('./usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES,
          ),
          component: ChangePasswordComponent // Use o componente standalone
      },
];