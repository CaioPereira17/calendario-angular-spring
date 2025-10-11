import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Usuario } from '../../model/usuario';
import { UsuariosService } from '../../services/usuarios.service';

import { AsyncPipe } from '@angular/common';
import { UntypedFormGroup } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { ConfimationDialogComponent } from '../../../shared/components/error-dialog/confimation-dialog/confimation-dialog.component';
import { UsuariosListaComponent } from '../../components/usuarios-lista/usuarios-lista.component';
import { UsuarioPage } from '../../model/usuario-page';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss',
    standalone: true,
    imports: [MatCard, MatToolbar, UsuariosListaComponent, UsuariosListaComponent, MatPaginator, MatProgressSpinner, AsyncPipe, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class UsuariosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator; // Vincule o paginator
  // }

  pageIndex = 0;
  pageSize = 10;
  termo = '';

  @Input() dataSource = new MatTableDataSource<Usuario>();

  usuarios$: Observable<UsuarioPage> | null = null;
  usuarios: Usuario[] = [];
  usuariosOriginais: Usuario[] = []; // Array com todos os registros originais

  form: UntypedFormGroup | undefined;

  constructor(
    private readonly usuariosService: UsuariosService,
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ){
    this.refresh();

    // this.usuarios.sort((a, b) => a.postoGraduacao.localeCompare(b.postoGraduacao));

    this.usuariosService.listUsuCompl().subscribe((data: Usuario[]) => {
      this.usuarios = data;
     });

   }

   // Escutar mudanças no campo 'usuario'
  onUsuarioChange(usuarioId: string): void {
  // Encontre a usuario selecionada a partir da lista de usuarios
  const selectedUsuario = this.usuarios.find(usuario => usuario._id === usuarioId);

  // Se a usuario tiver uma assessoria associada, atualize o campo 'assessoria'
  if (selectedUsuario && selectedUsuario.username) {
    // Add meaningful code here or remove the block if not needed
    console.log(`Selected usuario has assessoria: ${selectedUsuario.username}`);
  }
}

onSearchTermChange(value: string): void {
  if (value === '') {
    // Restaura a tabela ao estado inicial
    this.refresh({ length: 0, pageIndex: 0, pageSize: this.pageSize }, '');
  } else {
    // Aplica o filtro
    this.refresh({ length: 0, pageIndex: 0, pageSize: this.pageSize }, value);
  }
}

filterSelectDeUsuarios(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;

  // Verifica se o valor do input está vazio
  if (value.trim() === '') {
    // Restaura a lista original de usuarios
    this.usuarios = [...this.usuariosOriginais];
  } else {
    // Filtra os itens com base no termo digitado
    this.usuarios = this.usuariosOriginais.filter(usuario =>
      usuario.username.toLowerCase().includes(value.toLowerCase())
    );
  }
}



refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  this.usuarios$ = this.usuariosService.list(termo, pageEvent.pageIndex, pageEvent.pageSize).pipe(
    tap((response: UsuarioPage) => {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
      this.usuarios = response.pessoas; // Atualiza o array de usuários
      this.dataSource.data = this.usuarios; // Atualiza o DataSource
    }),
    catchError((error) => {
      this.onError('Erro ao carregar usuários');
      return of({ content: [], pessoas: [], totalElements: 0, totalPages: 0 });
    })
  );
}


  //  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10} , termo = '') {
  //   this.usuarios$ = this.usuariosService.list(termo, pageEvent.pageIndex, pageEvent.pageSize)
  //   .pipe(
  //     tap(() => {
  //       this.pageIndex = pageEvent.pageIndex;
  //       this.pageSize = pageEvent.pageSize;

  //     }),
  //       catchError ( error => {
  //       this.onError('Erro ao carregar usuarios');
  //       return of({content: [], pessoas: [], totalElements: 0, totalPages: 10 })
  //     })
  //   );
  // }

  // refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  //   this.usuariosService.list(termo, pageEvent.pageIndex, pageEvent.pageSize)
  //     .pipe(
  //       tap(response => {
  //         this.pageIndex = pageEvent.pageIndex;
  //         this.pageSize = pageEvent.pageSize;

  //         // Atualize a tabela com os novos dados
  //         this.dataSource.data = response.content;
  //       }),
  //       catchError(error => {
  //         this.onError('Erro ao carregar usuários');
  //         return of({ content: [], totalElements: 0, totalPages: 0 });
  //       })
  //     ).subscribe();
  // }



   onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.search(); // Recarrega os dados da nova página
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {
    // this.usuariosService.list().subscribe((data: UsuarioPage) => {
    //   console.log('Dados recebidos:', data); // Verifique se os dados estão chegando corretamente
    //   this.usuarios = data.content;
    //   // this.usuariosOriginais = [...data.content]; // Clona os dados originais
    //   // this.dataSource.data = this.usuarios;
    // });


    this.usuariosService.list().subscribe((data: UsuarioPage) => {
      console.log('Dados recebidos:', data); // Verifique se os dados estão chegando corretamente
      this.usuarios = data.pessoas; // Atualiza usando `pessoas`
      this.usuariosOriginais = [...data.pessoas]; // Clona os dados originais
      this.dataSource.data = this.usuarios; // Atualiza o DataSource
    });

  }


  onAdd(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(usuario: Usuario) {
    this.router.navigate(['edit', usuario._id], {relativeTo: this.route});
    this.refresh();
    }

  onRemove(usuario: Usuario) {

    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      data: 'Tem certeza quanto a remoção dessa usuario?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result){
        this.usuariosService.remove(usuario._id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Usuario removida com sucesso!', 'X', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'

            });
          }
        );
      }
    });


  }


}
