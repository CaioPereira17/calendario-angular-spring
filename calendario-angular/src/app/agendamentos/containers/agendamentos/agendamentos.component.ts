import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Agendamento } from '../../modelo/Agendamento';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfimationDialogComponent } from '../../../shared/components/error-dialog/confimation-dialog/confimation-dialog.component';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { AgendamentosService } from '../../services/agendamentos.service';
import { FormBuilder } from '@angular/forms';
import { ResizeEvent } from 'angular-resizable-element';
import { AgendamentosListaComponent } from '../../components/agendamentos-lista/agendamentos-lista.component';
import { AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AgendamentoPage } from '../../modelo/agendamento-page';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-agendamentos',
    templateUrl: './agendamentos.component.html',
    styleUrl: './agendamentos.component.scss',
    standalone: true,
    imports: [MatCard, MatToolbar, AgendamentosListaComponent,  MatPaginator, MatProgressSpinner, MatDatepickerModule, AsyncPipe, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class AgendamentosComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;
  length = 0;

  dataInicio: string | null | undefined = undefined;
  dataFim: string | null | undefined = undefined;

  termo = '';

  onResizeEnd(event: ResizeEvent): void {
    //console.log('Resize event:', event);
  }

  agendamentos$!: Observable<Agendamento[]>;
  agendamentos2$!: Observable<AgendamentoPage>;

  agendamentos: Agendamento[] = [];

  agendamentosOriginais: Agendamento[] = [];

  assessorias: Assessoria[] = [];

  assessoriasOriginais: Assessoria[] = [];

  constructor(
    private readonly assessoriasService: AssessoriasService,
    private readonly fb: FormBuilder,
    private readonly agendamentosService: AgendamentosService,
    // private agendamentoModalService: AgendamentoModalService,
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute

  ){
    this.refresh2();

    this.assessoriasService.list().subscribe((data: Assessoria[]) => {
      this.assessorias = data;
     })
  }

  refresh(){
  this.agendamentos$ = this.agendamentosService.list()
  .pipe(
    catchError(error => {
      this.onError('Erro ao carregar agendamentos');
      return of([])
    })
  );
}

refresh2(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  this.agendamentos2$ = this.agendamentosService.list2(termo, pageEvent.pageIndex, pageEvent.pageSize).pipe(
    tap((page: AgendamentoPage) => {
      // Atualize o estado local com os dados retornados
      this.agendamentos = page.content; // ou page.agendamentos dependendo do formato
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;

      console.log('Agendamentos carregados:', this.agendamentos);
    }),
    catchError(error => {
      this.onError('Erro ao carregar agendamentos');
      return of({ content: [], agendamentos:[], totalElements: 0, totalPages: 0 });
    })
  );
}

refresh3(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  const dataInicio = this.dataInicio ?? null;
  const dataFim = this.dataFim ?? null;
  this.agendamentos2$ = this.agendamentosService.list3(dataInicio, dataFim, pageEvent.pageIndex, pageEvent.pageSize).pipe(
    tap((page: AgendamentoPage) => {
      // Atualize o estado local com os dados retornados
      this.agendamentos = page.content; // ou page.agendamentos dependendo do formato
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;

      console.log('Agendamentos carregados:', this.agendamentos);
    }),
    catchError(error => {
      this.onError('Erro ao carregar agendamentos');
      return of({ content: [], agendamentos:[], totalElements: 0, totalPages: 0 });
    })
  );
}

// refresh3(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }): void {
//   this.agendamentosService.list3(this.dataInicio ?? null, this.dataFim ?? null, pageEvent.pageIndex, pageEvent.pageSize)
//     .subscribe({
//       next: (data: AgendamentoPage) => {
//         this.agendamentos = data.agendamentos; // Atualiza os agendamentos
//         this.pageIndex = pageEvent.pageIndex;
//         this.pageSize = pageEvent.pageSize;
//         console.log('Agendamentos carregados:', this.agendamentos);
//       },
//       error: (error) => {
//         console.error('Erro ao carregar agendamentos:', error);
//       },
//     });
// }





// refresh2(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
//   this.agendamentos2$ = this.agendamentosService.list2(termo, pageEvent.pageIndex, pageEvent.pageSize)
//   .pipe(
//     tap(() => {
//       this.pageIndex = pageEvent.pageIndex;
//       this.pageSize = pageEvent.pageSize;
//     }),
//     catchError(error => {
//       this.onError('Erro ao carregar agendamentos');
//       return of({ agendamentos: [], content: [], totalElements: 0, totalPages: 0 });
//     })
//   );
// }

onSearchByDate(type: 'inicio' | 'fim', value: Date | null): void {
  if (type === 'inicio') {
    this.dataInicio = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
  } else if (type === 'fim') {
    this.dataFim = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
  }

  console.log('Datas atualizadas:', { dataInicio: this.dataInicio, dataFim: this.dataFim });

  // Se ambos os campos de data estão vazios, reseta para o estado inicial
  if (!this.dataInicio && !this.dataFim) {
    this.loadAllAgendamentos(); // Carrega todos os agendamentos
  } else {
    this.refresh3({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }
}

// Método para carregar todos os agendamentos (estado inicial)
loadAllAgendamentos(): void {
  this.agendamentosService.getAllAgendamentos(this.pageSize, this.pageIndex).subscribe((response) => {
    this.agendamentos = response.content;
    this.length = response.totalElements;
  });
}


// onSearchByDate(type: 'inicio' | 'fim', value: Date | null): void {
//   if (type === 'inicio') {
//     this.dataInicio = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
//   } else if (type === 'fim') {
//     this.dataFim = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
//   }

//   console.log('Datas atualizadas:', { dataInicio: this.dataInicio, dataFim: this.dataFim });

//   this.refresh3({ length: 0, pageIndex: 0, pageSize: this.pageSize });
// }




     // Escutar mudanças no campo 'pessoa'
onAgendamentoChange(agendamentoId: string): void {
  // Encontre a pessoa selecionada a partir da lista de pessoas
  const selectedAgendamento = this.agendamentos.find(agendamento => agendamento.id === Number(agendamentoId));

  // Se a pessoa tiver uma assessoria associada, atualize o campo 'assessoria'
  if (selectedAgendamento && selectedAgendamento.assessoria) {
    // Add meaningful code here or remove the block if not needed
    console.log(`Selected pessoa has assessoria: ${selectedAgendamento.assessoria}`);
  }
}

onPageChange(event: PageEvent): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  // this.search(); // Recarrega os dados da nova página
}

onSearchByAssessoria(sigla: string): void {
  if (sigla === '') {
    // Se o usuário selecionar "Nenhum", restaura a tabela ao estado inicial.
    this.refresh2({ length: 0, pageIndex: 0, pageSize: this.pageSize }, '');
  } else {
    // Aplica o filtro para pesquisar agendamentos pela assessoria selecionada.
    this.refresh2({ length: 0, pageIndex: 0, pageSize: this.pageSize }, sigla);
  }
}

  onSearchTermChange(value: string): void {
    if (value === '') {
      // Restaura a tabela ao estado inicial
      this.refresh2({ length: 0, pageIndex: 0, pageSize: this.pageSize }, '');
    } else {
      // Aplica o filtro
      this.refresh2({ length: 0, pageIndex: 0, pageSize: this.pageSize }, value);
    }
  }

  filterSelectDeAssessorias(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Verifica se o valor do input está vazio
    if (value.trim() === '') {
      // Restaura a lista original de pessoas
      this.assessorias = [...this.assessoriasOriginais];
    } else {
      // Filtra os itens com base no termo digitado
      this.assessorias = this.assessoriasOriginais.filter(assessoria =>
        assessoria.sigla.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  // filterSelectDeAssessorias(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const value = inputElement.value;

  //   // Verifica se o valor do input está vazio
  //   if (value.trim() === '') {
  //     // Restaura a lista original de pessoas
  //     this.agendamentos = [...this.agendamentosOriginais];
  //   } else {
  //     // Filtra os itens com base no termo digitado
  //     this.agendamentos = this.agendamentosOriginais.filter(agendamento =>
  //       agendamento.assessoria.sigla.toLowerCase().includes(value.toLowerCase())
  //     );
  //   }
  // }


  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {
    this.assessoriasService.list().subscribe((data: Assessoria[]) => {
      this.assessorias = data;
      this.assessoriasOriginais = [...data]; // Clona os dados originais
    });
  }

  onAdd(){
    // console.log('entrei')
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(agendamento: Agendamento): void {
    if (agendamento.id) {
      this.router.navigate(['edit', agendamento.id], { relativeTo: this.route });
    } else {
      console.error('ID do agendamento está indefinido:', agendamento);
    }
  }


    onRemove(agendamento: Agendamento) {

    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      data: 'Tem certeza quanto a remoção desse agendamento?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result){
        this.agendamentosService.remove(agendamento.id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Agendamento removido com sucesso!', 'X', {
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

