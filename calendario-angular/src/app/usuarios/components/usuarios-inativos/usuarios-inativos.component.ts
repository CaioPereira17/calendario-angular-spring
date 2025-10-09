import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Usuario } from '../../model/usuario';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { UsuariosListaComponent } from '../usuarios-lista/usuarios-lista.component';
import { MatTableModule } from '@angular/material/table';
import { PostoGraduacao, PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios-inativos',
  templateUrl: './usuarios-inativos.component.html',
  styleUrls: ['./usuarios-inativos.component.scss'],
  standalone: true,
      imports: [MatCard, MatToolbar, UsuariosListaComponent,
                MatPaginator, MatTableModule, MatProgressSpinner,
                AsyncPipe, MatFormFieldModule, MatInputModule, MatSelectModule,
                CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
                MatCardModule, MatToolbarModule,  MatPaginatorModule, MatTableModule, MatIconModule]
})
export class UsuariosInativosComponent implements OnInit {
  usuariosInativos: Usuario[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @Output() add = new EventEmitter(false);
   @Output() edit = new EventEmitter(false);
   @Output() delete = new EventEmitter(false);

   readonly displayedColumns = ['username','role', 'liberado', 'acoes'];

  postos = PostoGraduacaoList;
   selectedPosto = PostoGraduacao.GEN_EXERCITO;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.carregarUsuariosInativas();
  }

  carregarUsuariosInativas(): void {
    console.log('entrou')
    this.usuariosService.listarInativas(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        console.log('entrou')
        this.usuariosInativos = data.pessoas;
        this.totalElements = data.totalElements;
        console.log('Usuarios inativas carregadas:', this.usuariosInativos);
      },
      error: (err) => console.error('Erro ao carregar usuarios inativas', err),
    });
  }


  reativarUsuario(id: number): void {
    if (!id) {
      console.error('ID inválido para reativação:', id);
      return;
    }

    this.usuariosService.reativarUsuario(id).subscribe({
      next: () => {
        console.log('Usuário reativado com sucesso:', id);
        this.carregarUsuariosInativas(); // Atualiza a tabela após reativar o usuário
      },
      error: (err) => {
        console.error('Erro ao reativar usuário:', err);
      }
    });
  }



  // reativarUsuario(id: number | undefined): void {
  //   if (!id) {
  //     console.error('ID inválido para reativação:', id);
  //     return;
  //   }

  //   this.usuariosService.reativarUsuario(id).subscribe({
  //     next: () => {
  //       alert('Usuario reativada com sucesso!');
  //       this.carregarUsuariosInativas(); // Recarrega a lista após reativação
  //     },
  //     error: (err) => console.error('Erro ao reativar usuario:', err),
  //   });
  // }


  refresh(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarUsuariosInativas();
  }

  getPostoImage(postoGraduacao: string): string {
      const posto = PostoGraduacaoList.find(p => p.viewValue === postoGraduacao);
      return posto ? posto.imageUrl : '';
    }

    onAdd(){
      this.add.emit(true);

    }

    onEdit(usuario: Usuario ){
      this.edit.emit(usuario);
    }

    onDelete(usuario: Usuario){
      this.delete.emit(usuario);

    }
}
