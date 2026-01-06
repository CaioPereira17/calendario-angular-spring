import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Pessoa } from '../../model/pessoa';
import { PessoasService } from '../../services/pessoas.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfimationDialogComponent } from '../../../shared/components/error-dialog/confimation-dialog/confimation-dialog.component';
import { PessoaPage } from '../../model/pessoa-page';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PessoasListaComponent } from '../../components/pessoas-lista/pessoas-lista.component';
import { AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
import { MatSelectModule } from '@angular/material/select';
import { UntypedFormGroup } from '@angular/forms';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { Assessoria } from '../../../assessorias/model/assessoria';



@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrl: './pessoas.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatToolbar,
    PessoasListaComponent,
    MatPaginator,
    MatProgressSpinner,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class PessoasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Paginação e Dados da Tabela
  pageIndex = 0;
  pageSize = 10;
  pessoas$: Observable<PessoaPage> | null = null;
  @Input() dataSource = new MatTableDataSource<Pessoa>();

  // Listas Auxiliares (Para Selects de busca interna)
  postos = PostoGraduacaoList;
  pessoas: Pessoa[] = [];
  pessoasOriginais: Pessoa[] = [];
  assessorias: Assessoria[] = [];
  assessoriasOriginais: Assessoria[] = [];

  // Filtros Atuais
  filtroTexto: string = '';
  filtroMes: number | '' = '';

  // Lista de Meses para o Filtro
  listaMeses = [
    { nome: 'Janeiro', valor: 1 }, { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 }, { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 }, { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 }, { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 }, { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 }, { nome: 'Dezembro', valor: 12 }
  ];

  constructor(
    private readonly pessoasService: PessoasService,
    private readonly assessoriasService: AssessoriasService,
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) {
    // Construtor limpo. A lógica vai para o ngOnInit.
  }

  ngOnInit(): void {
    // 1. Carrega a tabela principal
    this.refresh();

    // 2. Carrega as listas auxiliares para os dropdowns
    this.carregarListasAuxiliares();
  }

  // --- CARREGAMENTO DE DADOS ---

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    // Atualiza variaveis locais de paginação
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;

    // Chama o serviço passando: Texto, Paginação E O MÊS
    // OBS: Você precisará atualizar o método .list() no PessoasService
    this.pessoas$ = this.pessoasService.list(
      this.filtroTexto,
      this.pageIndex,
      this.pageSize,
      this.filtroMes // <--- Novo parâmetro enviado ao back
    ).pipe(
      tap(() => {
        // Sucesso
      }),
      catchError(error => {
        this.onError('Erro ao carregar pessoas');
        return of({ content: [], pessoas: [], totalElements: 0, totalPages: 0 });
      })
    );
  }



  carregarListasAuxiliares() {
    this.pessoasService.listPessCompl().subscribe((data: Pessoa[]) => {
      this.pessoas = data;
      this.pessoasOriginais = [...data];
    });

    this.assessoriasService.list().subscribe((data: Assessoria[]) => {
      this.assessorias = data;
      this.assessoriasOriginais = [...data];
    });
  }

  // --- EVENTOS DE FILTRO DA TABELA PRINCIPAL ---

  onSearchTermChange(value: string): void {
    this.filtroTexto = value; // Guarda o estado
    // Reseta para a primeira página ao filtrar
    this.refresh({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }

onAniversarianteChange(mes: number | ''): void {
    this.filtroMes = mes;

    if (mes) {
      // Se tem mês, força visualização expandida
      this.pageSize = 10;
      this.pageIndex = 0;
    } else {
      // Se limpou, volta ao padrão
      this.pageSize = 10;
      this.pageIndex = 0;
    }

    // --- CORREÇÃO AQUI ---
    // Força o componente visual do paginator a saber que o tamanho mudou
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = this.pageIndex;
    }

    // Chama o refresh
    this.refresh({ length: 0, pageIndex: this.pageIndex, pageSize: this.pageSize });
  }

  onPageChange(event: PageEvent): void {
    this.refresh(event);
  }

  // --- FILTROS DE CLIENTE (DENTRO DOS SELECTS) ---

  filterSelectDePessoas(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.trim() === '') {
      this.pessoas = [...this.pessoasOriginais];
    } else {
      this.pessoas = this.pessoasOriginais.filter(pessoa =>
        pessoa.nomeGuerra.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterSelectDeAssessorias(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.trim() === '') {
      this.assessorias = [...this.assessoriasOriginais];
    } else {
      this.assessorias = this.assessoriasOriginais.filter(assessoria =>
        assessoria.sigla.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  // --- AÇÕES DO CRUD ---

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(pessoa: Pessoa) {
    if (pessoa._id) {
      this.router.navigate(['edit', pessoa._id], { relativeTo: this.route });
    }
  }

  onRemove(pessoa: Pessoa) {
    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      data: 'Tem certeza quanto a remoção dessa pessoa?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.pessoasService.remove(pessoa._id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Pessoa removida com sucesso!', 'X', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          },
          error => this.onError('Erro ao tentar remover pessoa.')
        );
      }
    });
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }
}