import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Agendamento } from '../../modelo/Agendamento';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { AgendamentoModalComponent } from '../../containers/agendamento-form/agendamento-modal/agendamento-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AgendamentosService } from '../../services/agendamentos.service';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';


@Component({
    selector: 'app-agendamentos-lista',
    templateUrl: './agendamentos-lista.component.html',
    styleUrl: './agendamentos-lista.component.scss',
    standalone: true,
    imports: [MatCard, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatMiniFabButton, MatIcon, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class AgendamentosListaComponent implements OnInit {

  agendamentos$!: Observable<Agendamento[]>;

  diaAtivo: DateTime | null = null; // Defina a propriedade diaAtivo aqui
  @Input() agendamentos2: { [key: string]: Agendamento[] } = {}; // Inicializa com um objeto vazio
  @Input() agendamentos: Agendamento[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter<Agendamento>(); // Mudança aqui para passar o agendamento
  @Output() delete = new EventEmitter(false);

  readonly displayedColumns = ['dataInicio', 'dataFim' ,'horaInicio', 'horaFim', 'pessoa', 'assessoria', 'acoes'];


  dataSource = new MatTableDataSource<Agendamento>();
  dateHoje: string | undefined;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly agendamentosService: AgendamentosService
  ) { }


  ngOnInit(): void {

    this.dataSource.data = this.agendamentos;

    // this.http.get<Agendamento[]>('/api/agendamentos').subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log(data)
    // });


  }

  onAdd(){
    this.add.emit(true);
  }


   //Novo método para escutar o evento de edição
  onEdit(agendamento: Agendamento): void {
    // console.log(agendamento.id)
    if (agendamento.dataInicio) {
        const day = DateTime.fromISO(agendamento.dataInicio); // Mantém como DateTime
        // const day = DateTime.local(); // Usa a data atual como DateTime
        this.openAgendamentoModal(day, agendamento); // Chama o modal com o DateTime e o agendamento

    } else {
        console.error('A data do agendamento está indefinida.');
        // Define um comportamento padrão, como atribuir a data atual
        const day = DateTime.local(); // Usa a data atual como DateTime
        this.openAgendamentoModal(day, agendamento);
    }
}

openAgendamentoModal(day: DateTime, agendamento?: Agendamento): void {
  // Se o agendamento for passado, abrir o modal preenchido para edição
  if (agendamento) {
    const dialogRef = this.dialog.open(AgendamentoModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        agendamento: agendamento  // Passa o agendamento para ser editado
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualiza o agendamento existente
        Object.assign(agendamento, result);
        this.agendamentosService.save(agendamento).subscribe(() => {
          this.refresh();
          this.refreshCalendar();

        });
      }
    });
  } else {
    // Se não houver agendamento, abrir o modal vazio para criar um novo agendamento
    const dialogRef = this.dialog.open(AgendamentoModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        agendamento: null  // Passa null para indicar que é um novo agendamento
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adiciona o novo agendamento
        this.agendamentosService.save(result).subscribe(() => {
          this.refresh();
          this.refreshCalendar();
        });
      }
    });
  }
}

// openAgendamentoModal(day: DateTime, agendamento?: any): void {
//   const dateOnly = day.startOf('day');

//   const dataToPass = {
//     date: dateOnly,
//     agendamento: agendamento || null
//   };

//   const dialogRef = this.dialog.open(AgendamentoModalComponent, {
//     width: '600px',
//     data: dataToPass,
//     id: agendamento?.id // Verifica se o agendamento possui um ID
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       if (this.isAgendamentoValido(result, day)) {
//         // Aqui você deve adicionar a lógica para salvar o agendamento
//         // Exemplo:
//         this.agendamentosService.list().subscribe(() => {
//           this.snackBar.open('Agendamento atualizado com sucesso!', 'Fechar', {
//             duration: 3000
//           });
//           this.refresh(); // Atualiza a lista de agendamentos ao fechar o modal
//         });
//       } else {
//         this.snackBar.open('O agendamento não pode ser salvo. Existe um conflito de horário.', 'Fechar', {
//           duration: 5000
//         });
//       }
//     } else {
//       console.log('Modal fechado sem alterações.');
//     }
//   });
// }

  refreshCalendar(): void {
    this.agendamentosService.list().subscribe(agendamentos => {
      this.agendamentos = agendamentos; // Atualiza o array de agendamentos
      // Outras lógicas de atualização de calendário, se necessário
    });
  }


  refresh() {
    this.agendamentos$ = this.agendamentosService.list()
      .pipe(
        catchError(error => {
          this.onError();
          return of([]); // Retorna uma lista vazia em caso de erro
        })
      );

    // Se você quiser atualizar a lista no DataSource do MatTable também:
    this.agendamentosService.list().subscribe((agendamentos: Agendamento[]) => {
      this.dataSource.data = agendamentos;
    });
  }



  isAgendamentoValido(agendamento: any, day: DateTime): boolean {
    const agendamentosDoDia = this.getAgendamentosForDay(day);
    const horaInicioNovo = DateTime.fromISO(agendamento.horaInicio);
    const horaFimNovo = DateTime.fromISO(agendamento.horaFim);

    for (const ag of agendamentosDoDia) {
      const horaInicioExistente = DateTime.fromISO(ag.horaInicio);
      const horaFimExistente = DateTime.fromISO(ag.horaFim);

      // Verifica se o novo agendamento não está dentro do intervalo de um agendamento existente
      if (
        (horaInicioNovo < horaFimExistente && horaInicioNovo >= horaInicioExistente) ||
        (horaFimNovo > horaInicioExistente && horaFimNovo <= horaFimExistente)
      ) {
        return false; // Agendamento inválido
      }
    }

    return true; // Agendamento válido
  }

  getAgendamentosForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) {
      return []; // Retorna uma lista vazia se dayISO for null
    }

    // Verificar e depurar se os agendamentos estão sendo encontrados
    const agendamentos = this.agendamentos2[dayISO] || [];
    // console.log(`Agendamentos para ${dayISO}:`, agendamentos);
    return agendamentos.map(agendamento => {
      const horaInicio = agendamento.horaInicio ? DateTime.fromISO(agendamento.horaInicio).toFormat('HH:mm') : 'N/A';
      const horaFim = agendamento.horaFim ? DateTime.fromISO(agendamento.horaFim).toFormat('HH:mm') : 'N/A';
      this.refresh();
      return {
        horaInicio: horaInicio,
        horaFim: horaFim,
        assessoria: agendamento.assessoria
      };
    });
  }

  private onError() {
    this.dialog.open(ErrorDialogComponent, {
      data: 'Erro ao tentar realisar agendamento .'
    });
  }

  onDelete(agendamento: Agendamento) {
    this.delete.emit(agendamento);
  }

}
