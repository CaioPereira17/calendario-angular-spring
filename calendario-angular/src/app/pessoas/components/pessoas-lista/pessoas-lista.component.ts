// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
// import { Pessoa } from '../../model/pessoa';
// import {  MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
// import { CommonModule } from '@angular/common';
// import { PostoGraduacao, PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
// import { TipoAcesso, TipoAcessoList } from '../../../enums/TipoAcesso';

// import { MatIcon } from '@angular/material/icon';
// import { MatIconButton } from '@angular/material/button';

// import { MatCard } from '@angular/material/card';
// import { MatDialog } from '@angular/material/dialog';
// import { LoginService } from '../../../login/auth/login.service';
// import { PessoaDetalhesModalComponent } from '../pessoa-detalhes-modal/pessoa-detalhes-modal.component';
// @Component({
//     selector: 'app-pessoas-lista',
//     templateUrl: './pessoas-lista.component.html',
//     styleUrl: './pessoas-lista.component.scss',
//     standalone: true,
//     imports: [MatCard, MatTable, MatColumnDef,
//               MatHeaderCellDef, MatHeaderCell,
//               MatCellDef, MatCell, MatIcon,
//               MatIconButton, MatHeaderRowDef,
//               MatHeaderRow, MatRowDef, MatRow, CommonModule 
//               ]
// })
// export class PessoasListaComponent implements OnInit {



//  @Input() pessoas: Pessoa[] = [];
//  @Output() add = new EventEmitter(false);
//  @Output() edit = new EventEmitter(false);
//  @Output() delete = new EventEmitter(false);


//  postos = PostoGraduacaoList;
//  selectedPosto = PostoGraduacao.GEN_EXERCITO;


//  acessos = TipoAcessoList;
//  selectedAcesso: TipoAcesso | undefined;




//   readonly displayedColumns = ['caminho','identidade', 'nome', 'postoGraduacao', 'nomeGuerra',  'assessoria', 'ramal', 'acoes'];
//   userHasPermission!: boolean; // Variável para armazenar se o usuário tem permissão


//   constructor(private dialog: MatDialog, private loginService: LoginService, private cdRef: ChangeDetectorRef){  }

//  //alteração feita por Cabo Caio e Sgt Faro 

//   ngOnInit(): void {
//     // Initialization logic can be added here if needed
//     //Anotação  Caio Remover
//     console.log('Funcionou aqui !');
//     this.checkUserPermission();
//   }

//   checkUserPermission() {
//     this.userHasPermission = this.loginService.hasPermission('TI') || this.loginService.hasPermission('ADMINISTRADOR') || this.loginService.hasPermission('DIV_PESS'); 
//     //Anotação  Caio Remover
//     //console.log(this.userHasPermission);// Verifica se o usuário tem a role "TI"
//     this.cdRef.detectChanges(); // Força o Angular a detectar a mudança
//   }

//   openModal(pessoa: any) {
//     const dialogRef = this.dialog.open(PessoaDetalhesModalComponent, {
//       width: '400px',
//       data: pessoa
//     });
  
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         console.log("Pessoa atualizada:", result);
//         // Atualiza a lista localmente
//         Object.assign(pessoa, result);
//       }
//     });
//   }


//   onImageError(event: Event): void {
//     const element = event.target as HTMLImageElement;
//     element.src = 'http://localhost:8080/media/branco.jpg';
//   }

//   onAdd(){
//     this.add.emit(true);

//   }

//   onEdit(pessoa: Pessoa ){
//     this.edit.emit(pessoa);
//   }

//   onDelete(pessoa: Pessoa){
//     this.delete.emit(pessoa);

//   }

//   getPostoImage(postoGraduacao: string): string {
//     const posto = PostoGraduacaoList.find(p => p.viewValue === postoGraduacao);
//     return posto ? posto.imageUrl : '';
//   }

// }

//Caio + ai att, adicionado a função para verificar permissão se for adm ou usuário x consegue ver a identidade do militar.
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pessoa } from '../../model/pessoa';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PostoGraduacao, PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
import { TipoAcesso, TipoAcessoList } from '../../../enums/TipoAcesso';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../login/auth/login.service';
import { PessoaDetalhesModalComponent } from '../pessoa-detalhes-modal/pessoa-detalhes-modal.component';

@Component({
    selector: 'app-pessoas-lista',
    templateUrl: './pessoas-lista.component.html',
    styleUrl: './pessoas-lista.component.scss',
    standalone: true,
    imports: [MatCard, MatTable, MatColumnDef,
              MatHeaderCellDef, MatHeaderCell,
              MatCellDef, MatCell, MatIcon,
              MatIconButton, MatHeaderRowDef,
              MatHeaderRow, MatRowDef, MatRow, CommonModule
             ]
})
export class PessoasListaComponent implements OnInit {

  @Input() pessoas: Pessoa[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() delete = new EventEmitter(false);

  postos = PostoGraduacaoList;
  selectedPosto = PostoGraduacao.GEN_EXERCITO;

  acessos = TipoAcessoList;
  selectedAcesso: TipoAcesso | undefined;

  // --- MUDANÇA 1: A variável foi restaurada e inicializada ---
  // Esta variável agora pode ser usada em todo o seu template HTML
  userHasPermission: boolean = false;

  // A lista de colunas começa sem 'identidade'
  displayedColumns = ['caminho', 'nome', 'postoGraduacao', 'nomeGuerra', 'assessoria', 'ramal', 'acoes'];

  constructor(
    private dialog: MatDialog,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // --- MUDANÇA 2: A lógica foi consolidada no ngOnInit ---

    // 1. Calcula a permissão e armazena na variável da classe
    this.userHasPermission =
      this.loginService.hasPermission('TI') ||
      this.loginService.hasPermission('ADMINISTRADOR') ||
      this.loginService.hasPermission('DIV_PESS');

    // 2. Usa o resultado para decidir se a coluna deve ser adicionada
    if (this.userHasPermission) {
      // Insere 'identidade' na segunda posição do array
      this.displayedColumns.splice(1, 0, 'identidade');
    }
  }

  openModal(pessoa: any) {
    const dialogRef = this.dialog.open(PessoaDetalhesModalComponent, {
      width: '400px',
      data: pessoa
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Pessoa atualizada:", result);
        Object.assign(pessoa, result);
      }
    });
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'http://localhost:8080/media/branco.jpg';
  }

  onAdd() {
    this.add.emit(true);
  }

  onEdit(pessoa: Pessoa) {
    this.edit.emit(pessoa);
  }

  onDelete(pessoa: Pessoa) {
    this.delete.emit(pessoa);
  }

  getPostoImage(postoGraduacao: string): string {
    const posto = PostoGraduacaoList.find(p => p.viewValue === postoGraduacao);
    return posto ? posto.imageUrl : '';
  }
}