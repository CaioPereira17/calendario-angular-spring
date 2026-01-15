import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';

// Material Imports
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// RxJS
import { catchError, Observable, of, tap } from 'rxjs';

// Application Imports
import { PessoasListaComponent } from '../../components/pessoas-lista/pessoas-lista.component';
import { PessoasService } from '../../services/pessoas.service';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { Pessoa } from '../../model/pessoa';
import { PessoaPage } from '../../model/pessoa-page';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { ConfimationDialogComponent } from '../../../shared/components/error-dialog/confimation-dialog/confimation-dialog.component';

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
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class PessoasComponent implements OnInit {

  // --- VIEW CHILDREN & INPUTS ---
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() dataSource = new MatTableDataSource<Pessoa>();

  // --- ESTADO DA PAGINAÇÃO ---
  pageIndex = 0;
  pageSize = 10;
  pessoas$: Observable<PessoaPage> | null = null;

  // --- DADOS AUXILIARES (Listas para Selects) ---
  postos = PostoGraduacaoList;
  
  // Listas locais para filtragem no front (Selects)
  pessoas: Pessoa[] = [];
  pessoasOriginais: Pessoa[] = [];
  
  assessorias: Assessoria[] = [];
  assessoriasOriginais: Assessoria[] = [];

  listaMeses = [
    { nome: 'Janeiro', valor: 1 }, { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 }, { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 }, { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 }, { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 }, { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 }, { nome: 'Dezembro', valor: 12 }
  ];

  // --- FILTROS ATIVOS ---
  filtroTexto: string = '';
  filtroAssessoria: string = '';
  filtroMes: number | '' = '';

  constructor(
    private readonly pessoasService: PessoasService,
    private readonly assessoriasService: AssessoriasService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.carregarListasAuxiliares();
  }

  // ============================================================
  // CARREGAMENTO DE DADOS (BACKEND)
  // ============================================================

  // 1. Update refresh to pass separate parameters
  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;

    // Call service with distinct parameters
    this.pessoas$ = this.pessoasService.list(
      this.filtroTexto,       // Name search only
      this.filtroAssessoria,  // Assessoria search only
      this.pageIndex,
      this.pageSize,
      this.filtroMes
    ).pipe(
      tap(() => { /* Success */ }),
      catchError(error => {
        this.onError('Erro ao carregar pessoas');
        return of({ content: [], pessoas: [], totalElements: 0, totalPages: 0 });
      })
    );
  }


  carregarListasAuxiliares() {
    // Carrega lista completa para o AutoComplete/Select de Pessoas
    this.pessoasService.listPessCompl().subscribe((data: Pessoa[]) => {
      this.pessoas = data;
      this.pessoasOriginais = [...data];
    });

    // Carrega lista completa para o AutoComplete/Select de Assessorias
    this.assessoriasService.list().subscribe((data: Assessoria[]) => {
      this.assessorias = data;
      this.assessoriasOriginais = [...data];
    });
  }

  // ============================================================
  // GERENCIAMENTO DE EVENTOS DE FILTRO (TABELA)
  // ============================================================

  onSearchTermChange(value: string): void {
    this.filtroTexto = value;
    this.refresh({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }

  // 2. Fix the event handler
  onAssessoriaFilterChange(value: string): void {
    this.filtroAssessoria = value;
    
    const inputElement = { target: { value: value } } as any;
    this.filterSelectDeAssessorias(inputElement);
    
    // Refresh the table
    this.refresh({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }


  onAniversarianteChange(mes: number | ''): void {
    this.filtroMes = mes;

    // Ajusta tamanho da página se for filtro de aniversário
    if (mes) {
      this.pageSize = 100;
      this.pageIndex = 0;
    } else {
      this.pageSize = 10;
      this.pageIndex = 0;
    }

    // Sincroniza visual do paginator
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = this.pageIndex;
    }

    this.refresh({ length: 0, pageIndex: this.pageIndex, pageSize: this.pageSize });
  }

  onPageChange(event: PageEvent): void {
    this.refresh(event);
  }

  // ============================================================
  // FILTROS VISUAIS (CLIENT-SIDE PARA OS SELECTS)
  // ============================================================

  filterSelectDePessoas(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    
    if (!value) {
      this.pessoas = [...this.pessoasOriginais];
    } else {
      this.pessoas = this.pessoasOriginais.filter(pessoa =>
        pessoa.nomeGuerra.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterSelectDeAssessorias(event: Event) {
    // Nota: event pode vir como objeto mockado do onAssessoriaFilterChange ou evento real do DOM
    const target = event.target as HTMLInputElement | null;
    const value = target ? target.value : '';

    if (!value || value.trim() === '') {
      this.assessorias = [...this.assessoriasOriginais];
    } else {
      this.assessorias = this.assessoriasOriginais.filter(assessoria =>
        assessoria.sigla.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  // ============================================================
  // AÇÕES (CRUD E EXPORTAÇÃO)
  // ============================================================

  exportarPdf() {
    this.snackBar.open('Gerando PDF...', 'Aguarde', { duration: 2000 });

    const termoParaPdf = this.filtroAssessoria ? '' : this.filtroTexto;
    this.pessoasService.exportarPdf(termoParaPdf, this.filtroAssessoria, this.filtroMes)
      .subscribe({
        next: (data: Blob) => {
          const fileURL = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `relatorio_ramais_${new Date().getTime()}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(fileURL);
        },
        error: (error) => {
          console.error(error);
          this.onError('Erro ao gerar o relatório PDF.');
        }
      });
  }

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

  // ============================================================
  // UTILITÁRIOS
  // ============================================================

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, { data: errorMsg });
  }
}