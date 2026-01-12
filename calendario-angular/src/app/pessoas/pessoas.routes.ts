import { Routes } from "@angular/router";
import { PessoasFormComponent } from "./containers/pessoas-form/pessoas-form.component";
import { PessoasComponent } from "./containers/pessoas/pessoas.component";
import { PessoaResolver } from "./guards/pessoa.resolver";
import { PessoasInativasComponent } from "./components/pessoas-inativas/pessoas-inativas.component";
import { PessoasExternasFormComponent } from "./containers/pessoas-externas-form/pessoas-externas-form.component";

// export const PESSOAS_ROUTES: Routes = [
//   { path: '', component: PessoasComponent},
//   { path: 'new', component: PessoasFormComponent, resolve:{pessoa: PessoaResolver}},
//   { path: 'edit/:id', component: PessoasFormComponent, resolve:{pessoa: PessoaResolver}},
//   { path: 'inativas', component: PessoasInativasComponent, resolve:{pessoa: PessoaResolver}},
//   { path: 'pessoas/externas/new', component: PessoasExternasFormComponent }, // NOVA ROTA

// ];
// export const PESSOAS_ROUTES: Routes = [
//   { path: '', component: PessoasComponent },
  
//   { path: 'new', component: PessoasFormComponent, resolve: { pessoa: PessoaResolver } },
  
//   // --- CORREÇÃO AQUI ---
//   // 1. Removi "pessoas/" do início.
//   // 2. Adicionei o resolver (opcional, mas bom para evitar erros no ngOnInit se você usa ele).
//   { path: 'externas/new', component: PessoasExternasFormComponent, resolve: { pessoa: PessoaResolver } }, 

//   { path: 'inativas', component: PessoasInativasComponent, resolve: { pessoa: PessoaResolver } },
  
//   { path: 'edit/:id', component: PessoasFormComponent, resolve: { pessoa: PessoaResolver } }
// ];

export const PESSOAS_ROUTES: Routes = [
  { path: '', component: PessoasComponent },
  
  // Rotas de Criação
  { path: 'new', component: PessoasFormComponent, resolve: { pessoa: PessoaResolver } },
  { path: 'externas/new', component: PessoasExternasFormComponent, resolve: { pessoa: PessoaResolver } },
  { path: 'inativas', component: PessoasInativasComponent, resolve:{pessoa: PessoaResolver}},
  // --- NOVA ROTA AQUI (Edição de Externos) ---
  { path: 'externas/edit/:id', component: PessoasExternasFormComponent, resolve: { pessoa: PessoaResolver } },

  // Rota de Edição Padrão (Mantenha por último se possível ou logo após as outras)
  { path: 'edit/:id', component: PessoasFormComponent, resolve: { pessoa: PessoaResolver } }
];