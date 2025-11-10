import { Component, computed, ElementRef, EventEmitter, Input, input, InputSignal, OnInit, Output, signal, Signal, ViewChild, WritableSignal } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AgendamentosService } from '../../services/agendamentos.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Location, NgClass } from '@angular/common';
import { Pessoa } from '../../../pessoas/model/pessoa';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { PessoasService } from '../../../pessoas/services/pessoas.service';
import { AgendamentoModalComponent } from './agendamento-modal/agendamento-modal.component';
import { Meetings } from './meetings.interface';
import { DateTime, Info, Interval } from 'luxon';
import { Agendamento } from '../../modelo/Agendamento';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { ResizeEvent, ResizableModule } from 'angular-resizable-element';
import { CalendarEvent } from 'angular-calendar';
import { DropEvent, DragAndDropModule } from 'angular-draggable-droppable';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';


@Component({
    selector: 'app-agendamento-form',
    templateUrl: './agendamento-form.component.html',
    styleUrl: './agendamento-form.component.scss',
    standalone: true,
    imports: [
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    ResizableModule,
    DragAndDropModule,
    NgClass
],
})
export class AgendamentoFormComponent implements OnInit {

isResizing: boolean = false;
startX: number = 0; // Coordenada inicial para calcular o redimensionamento

startResize(event: MouseEvent, agendamento: Agendamento) {
  this.isResizing = true;
  this.startX = event.clientX; // Captura a posição inicial do mouse
}

resizeEvent(event: MouseEvent, agendamento: Agendamento) {
  if (!this.isResizing) return;

  const distanceMoved = event.clientX - this.startX; // Calcula a distância movida
  const daysResized = Math.floor(distanceMoved / this.calendarCellWidth); // Converte a distância em dias

  if (daysResized > 0) {
    const newEndDate = DateTime.fromISO(agendamento.dataInicio || DateTime.local().toISODate()).plus({ days: daysResized });
    agendamento.dataFim = newEndDate.toISODate() ?? undefined;
  }
}

endResize(event: MouseEvent, agendamento: Agendamento) {
  if (this.isResizing) {
    this.isResizing = false;

    // Salva o agendamento atualizado com a nova dataFim
    this.service.save(agendamento).subscribe(() => {
      this.snackBar.open('Agendamento redimensionado com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
    });
  }
}




  selectedDate: Date | undefined; // Propriedade que vai armazenar a data selecionada

   calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]; // Plugins do FullCalendar
  calendarEvents = [
    { title: 'Evento 1', start: '2024-10-14' },
    { title: 'Evento 2', start: '2024-10-15' }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Defina o tipo de visualização inicial
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin], // Certifique-se de incluir todos os plugins
    events: [
      { title: 'event 1', date: '2024-10-01' },
      { title: 'event 2', date: '2024-10-02' }
    ],
    dateClick: this.handleDateClick.bind(this), // A função de clique na data
    eventClick: this.handleEventClick.bind(this) // A função de clique no evento
  };

  handleDateClick(event: any) {
    // Lógica ao clicar em uma data
    alert('Data clicada: ' + event.dateStr);
  }

  handleEventClick(event: any) {
    // Lógica ao clicar em um evento
    alert('Evento clicado: ' + event.event.title);
  }

  // onDragEnd(event: DropEvent<Agendamento>, newDay: DateTime, agendamento: Agendamento): void {
  //   event.event.stopPropagation(); // Previne a propagação do evento de clique

  //   if (agendamento && newDay) {
  //     agendamento.dataInicio = newDay.toISODate() ?? undefined;
  //     agendamento.dataFim = newDay.toISODate() ?? undefined;

  //     // Salva o agendamento atualizado sem abrir o modal
  //     this.service.save(agendamento).subscribe(() => {
  //       this.snackBar.open('Agendamento movido com sucesso!', 'Fechar', { duration: 3000 });
  //       this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
  //     });
  //   }
  // }


  // handleEventClick(dayOfMonth: DateTime, agendamento: Agendamento, event: MouseEvent): void {
  //   event.stopPropagation(); // Impede que o clique na célula acione o modal de criação
  //   this.openAgendamentoModal(dayOfMonth, agendamento); // Abra o modal apenas para edição
  // }


  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  agendamento!: Agendamento;

  agendamentos$!: Observable<Agendamento[]>;

  @Input() agendamentos2: { [key: string]: Agendamento[] } = {}; // Inicializa com um objeto vazio

  agendamentos: InputSignal<Meetings> = input.required();
  hoje: Signal<DateTime> = signal(DateTime.local());
  primeiroDiaDoMesAtivo: WritableSignal<DateTime> = signal(
    this.hoje().startOf('month'),
  );

  // handleDateClick(event: any) {
  //   this.agendamento = {id:0, pessoa:{_id:'', identidade:'', users:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', acesso:'', dataUltimaPromocao:0, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0}, ramal:'', caminho:'',  }, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0} }; // Limpar o objeto
  //   // this.displayModal = true;
  // }

  // handleEventClick(event: any) {
  //   this.agendamento = { ...event.data }; // Preencher com dados do evento
  //   // this.openAgendamentoModal = true;
  // }

  onEventResize(event: any) {
    this.agendamento.dataInicio = event.newStart;
    this.agendamento.dataFim = event.newEnd;
    this.service.save(this.agendamento);
  }

  onEventDrop(event: any) {
    this.agendamento.dataInicio = event.newStart; // Atualizar com a nova data
    this.service.save(this.agendamento);
  }


  diaAtivo: WritableSignal<DateTime | null> = signal(null);
  diasDaSemana: Signal<string[]> = signal(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
  // diasDaSemana: Signal<string[]> = signal(['domingo', ...Info.weekdays('short').slice(0, 6)]);


  daysOfMonth: Signal<DateTime[]> = computed(() => {
    // Define o primeiro e o último dia do mês atual
    const startOfCurrentMonth = this.primeiroDiaDoMesAtivo().startOf('month');
    const endOfCurrentMonth = this.primeiroDiaDoMesAtivo().endOf('month');

    // Calcula os dias da semana em que o primeiro e o último dia do mês atual caem
    const startOfWeek = startOfCurrentMonth.weekday;
    const endOfWeek = endOfCurrentMonth.weekday;

    // Adiciona dias necessários do mês anterior para completar a primeira semana
    let days = [];
    if (startOfWeek !== 7) { // Se não for domingo
      const daysFromPreviousMonth = startOfCurrentMonth.minus({ days: startOfWeek });
      for (let i = 0; i < startOfWeek; i++) {
        days.push(daysFromPreviousMonth.plus({ days: i }));
      }
    }

    // Adiciona todos os dias do mês atual
    for (let i = 0; i < endOfCurrentMonth.day; i++) {
      days.push(startOfCurrentMonth.plus({ days: i }));
    }

    // Adiciona dias do mês seguinte para completar a última semana até atingir 35 dias
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfCurrentMonth.plus({ days: i }));
    }

    return days.slice(0, 35); // Retorna exatamente 35 dias
  });

  DATE_MED = DateTime.DATE_MED;

  activeDayMeetings: Signal<any[]> = computed(() => {
    const activeDay = this.diaAtivo();
    if (activeDay === null) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      return [];
    }

    return this.agendamentos2[activeDayISO]?.map(agendamento => ({
      horaInicio: agendamento.horaInicio ? DateTime.fromISO(agendamento.horaInicio).toFormat('HH:mm') : 'N/A',
      horaFim: agendamento.horaFim ? DateTime.fromISO(agendamento.horaFim).toFormat('HH:mm') : 'N/A',
      assessoria: agendamento.assessoria
    })) || [];
  });


  goToPreviousMonth(): void {
    this.primeiroDiaDoMesAtivo.set(
      this.primeiroDiaDoMesAtivo().minus({ month: 1 }),
    );
  }

  goToNextMonth(): void {
    this.primeiroDiaDoMesAtivo.set(
      this.primeiroDiaDoMesAtivo().plus({ month: 1 }),
    );
  }

  // goToToday(): void {
  //   this.primeiroDiaDoMesAtivo.set(this.hoje().startOf('month'));
  // }


  goToToday() {
    this.viewDate = new Date();
  }

  previousMonth() {
    const prevMonth = new Date(this.viewDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    this.viewDate = prevMonth;
  }

  nextMonth() {
    const nextMonth = new Date(this.viewDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.viewDate = nextMonth;
  }

  getAgendamentosForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) {
      return []; // Retorna uma lista vazia se dayISO for null
    }

    // Verificar e depurar se os agendamentos estão sendo encontrados
    const agendamentos = Object.values(this.agendamentos2).flat(); // Obtém todos os agendamentos
    const renderedAgendamentos: any[] = [];

    return agendamentos.filter(agendamento => {
      const dataInicio = agendamento.dataInicio ? DateTime.fromISO(agendamento.dataInicio).toISODate() : null;
      const dataFim = agendamento.dataFim ? DateTime.fromISO(agendamento.dataFim).toISODate() : null;

      // Verifica se o dia atual está no intervalo entre dataInicio e dataFim
    if (dataInicio && dataFim && DateTime.fromISO(dayISO) >= DateTime.fromISO(dataInicio) && DateTime.fromISO(dayISO) <= DateTime.fromISO(dataFim)) {
      // Adiciona o agendamento apenas se ele ainda não foi renderizado nesta célula
      if (!renderedAgendamentos.find(a => a.id === agendamento.id)) {
        renderedAgendamentos.push(agendamento);
        return true;
      }
    }
    return false;
  });
  }


  // getAgendamentosForDay(day: DateTime): any[] {
  //   const dayISO = day.toISODate();
  //   if (!dayISO) {
  //     return []; // Retorna uma lista vazia se dayISO for null
  //   }

  //   // Verificar e depurar se os agendamentos estão sendo encontrados
  //   const agendamentos = this.agendamentos2[dayISO] || [];
  //   // console.log(`Agendamentos para ${dayISO}:`, agendamentos);
  //   return agendamentos.map(agendamento => {
  //     const horaInicio = agendamento.horaInicio ? DateTime.fromISO(agendamento.horaInicio).toFormat('HH:mm') : 'N/A';
  //     const horaFim = agendamento.horaFim ? DateTime.fromISO(agendamento.horaFim).toFormat('HH:mm') : 'N/A';

  //     return {
  //       // Preenche o modal para edição, quando clicado em um agengamento existente a partir do calendário
  //       id: agendamento.id,
  //       dataInicio: agendamento.dataInicio,
  //       dataFim: agendamento.dataFim,
  //       horaInicio: agendamento.horaInicio,
  //       horaFim: agendamento.horaFim,
  //       pessoa: agendamento.pessoa,
  //       assessoria: agendamento.assessoria,
  //       acessorios: agendamento.acessorios,
  //       audiencia: agendamento.audiencia,
  //       evento: agendamento.evento,
  //       diex: agendamento.diex,
  //       militarLigacao: agendamento.militarLigacao


  //     };
  //   });
  // }

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

  form: UntypedFormGroup;
  pessoas: Pessoa[] = [];
  assessorias: Assessoria[] = [];

  days: any;

  @Output() add = new EventEmitter(false);

  constructor( private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private service: AgendamentosService,
    // private agendamentoModalService: AgendamentoModalService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private assessoriasService: AssessoriasService,
    private pessoasService: PessoasService,

  ) {

    this.selectedDate = new Date();
    this.form = this.formBuilder.group({
      _id: [''],
      dataInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFim: [''],
      pessoa: [null],
      assessoria: [null]
    });
  }

  eventos:any;
    @ViewChild('external') external: ElementRef | undefined;
    options: any;

  trackById(index: number, meeting: any): number {
    return meeting.id; // Substitua 'id' pelo campo que identifica exclusivamente o objeto
  }


  ngOnInit(): void {
  // Carrega os agendamentos do servidor
  this.http.get<Agendamento[]>('/api/agendamentos').subscribe(dataInicio => {
    this.agendamentos2 = this.mapAgendamentosPorData(dataInicio);
    console.log('Agendamentos carregados:', this.agendamentos2); // Adicione este log
  });

}

// Mapeia os agendamentos por data
mapAgendamentosPorData(agendamentos: Agendamento[]): { [key: string]: Agendamento[] } {
  const agendamentosMap: { [key: string]: Agendamento[] } = {};

  agendamentos.forEach(agendamento => {
    if (agendamento.dataInicio && agendamento.dataFim) {
      const dataInicio = DateTime.fromISO(agendamento.dataInicio);
      const dataFim = DateTime.fromISO(agendamento.dataFim);

      // Itera sobre cada dia entre dataInicio e dataFim
      for (let day = dataInicio; day <= dataFim; day = day.plus({ days: 1 })) {
        const dayISO = day.toISODate();

        // Certifique-se de que o agendamento não está sendo duplicado no mesmo dia
        if (dayISO && !agendamentosMap[dayISO]?.some(a => a.id === agendamento.id)) {
          if (!agendamentosMap[dayISO]) {
            agendamentosMap[dayISO] = [];
          }
          agendamentosMap[dayISO].push(agendamento);
        }
      }
    }
  });

  return agendamentosMap;
}




// openAgendamentoModal(day: DateTime, agendamento?: Agendamento): void {
//   const dataToPass = agendamento
//     ? { // Se houver um agendamento, passa os dados para edição
//         date: day.toISODate(),
//         agendamento: agendamento
//       }
//     : { // Caso contrário, passa um objeto vazio para criação
//         date: day.toISODate(),
//         agendamento: null
//       };

//   const dialogRef = this.dialog.open(AgendamentoModalComponent, {
//     width: '600px',
//     data: dataToPass
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       // Se houver resultado, processa o resultado
//       if (agendamento) {
//         // Aqui você atualiza o agendamento existente
//         Object.assign(agendamento, result);
//       } else {
//         // Aqui você cria um novo agendamento
//         this.service.save(result).subscribe(() => {
//           this.refreshCalendar();
//           });
//       }
//     }
//   });
// }

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
        this.service.save(agendamento).subscribe(() => {
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
        this.service.save(result).subscribe(() => {
          this.refreshCalendar();
        });
      }
    });
  }
}


addNewEvent(): void {
  const dialogRef = this.dialog.open(AgendamentoModalComponent, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.events = [
        ...this.events,
        {
          title: result.title,
          start: result.start,
          end: result.end,
          color: {
            primary: '#ad2121',
            secondary: '#FAE3E3',
          },
        },
      ];
    }
  });
}

handleEvent(event: CalendarEvent): void {
  const dialogRef = this.dialog.open(AgendamentoModalComponent, {
    width: '400px',
    data: event,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      event.title = result.title;
      event.start = result.start;
      event.end = result.end;
    }
  });
}

onDrop(event: DropEvent, newDay: DateTime): void {
  const agendamento = event.dropData as Agendamento;

  if (agendamento && newDay) {
    // A lógica de mover o evento é simples, apenas atualizamos a data de início e fim mantendo a duração original
    const dataInicioOriginal = agendamento.dataInicio ? DateTime.fromISO(agendamento.dataInicio) : DateTime.local();
    const dataFimOriginal = agendamento.dataFim ? DateTime.fromISO(agendamento.dataFim) : dataInicioOriginal;

    // Calcula a duração original do agendamento
    const originalDuration = dataFimOriginal.diff(dataInicioOriginal, 'days').days;

    // Atualiza a data de início para a nova data (nova posição)
    agendamento.dataInicio = newDay.toISODate() ?? undefined;

    // Atualiza a data de fim com base na duração original
    agendamento.dataFim = newDay.plus({ days: originalDuration }).toISODate() ?? undefined;

    // Salva o agendamento movido
    this.service.save(agendamento).subscribe(() => {
      this.snackBar.open('Agendamento movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
    });
  }
}



// onDrop(event: DropEvent, newDay: DateTime): void {
//   const agendamento = event.dropData as Agendamento;

//   if (agendamento && newDay) {
//     // Atualiza a data de início e fim do agendamento para o novo dia
//     agendamento.dataInicio = newDay.toISODate() ?? undefined;  // Atualiza a data do agendamento
//     agendamento.dataFim = newDay.toISODate() ?? undefined;  // Atualiza a data do agendamento

//     // Atualize a hora de início e fim, se necessário. Você pode manter o mesmo horário
//     // ou ajustar de acordo com a necessidade do seu sistema.

//     this.service.save(agendamento).subscribe(() => {
//       this.snackBar.open('Agendamento movido com sucesso!', 'Fechar', { duration: 3000 });
//       this.refreshCalendar();  // Atualiza o calendário para refletir as mudanças
//     });
//   }
// }

calendarCellWidth: number = 100; // Suponha que você conheça a largura de cada célula de dia

onResizeEnd(event: ResizeEvent, agendamento: Agendamento): void {
  // Certifique-se de que o redimensionamento está ocorrendo na borda direita
  if (event.edges.right) {
    // Calcule a quantidade de dias redimensionados
    const resizedDays = Math.round((event.rectangle.width ?? 0) / this.calendarCellWidth);

    if (resizedDays > 0) {
      const dataInicio = agendamento.dataInicio ? DateTime.fromISO(agendamento.dataInicio) : DateTime.local();

      // A nova data de fim é calculada com base nos dias redimensionados
      const newEndDate = dataInicio.plus({ days: resizedDays });

      // Atualiza a data de fim com base no redimensionamento
      agendamento.dataFim = newEndDate.toISODate() ?? undefined;

      // Salva o agendamento atualizado
      this.service.save(agendamento).subscribe(() => {
        this.snackBar.open('Agendamento redimensionado com sucesso!', 'Fechar', { duration: 3000 });
        this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
      });
    }
  }
}

handleDrop(event: DropEvent<Agendamento>, newDay: DateTime): void {
  const agendamento = event.dropData;

  if (agendamento && newDay) {
    // Atualiza as datas de início e fim para a nova data
    agendamento.dataInicio = newDay.toISODate() ?? undefined;
    agendamento.dataFim = newDay.toISODate() ?? undefined;

    // Salvar o agendamento atualizado
    this.service.save(agendamento).subscribe(() => {
      this.snackBar.open('Agendamento movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar();  // Atualiza o calendário
    });
  }
}






// onResizeEnd(event: ResizeEvent, agendamento: Agendamento): void {

//   console.log('Evento de redimensionamento:', event);

//   // Calcule a quantidade de dias que o evento foi redimensionado
//   const resizedDays = Math.ceil((event.rectangle.width ?? 0) / this.calendarCellWidth); // Assuma que você tenha uma variável 'calendarCellWidth'

//   if (resizedDays > 0) {
//     const startDate = agendamento.dataInicio ? DateTime.fromISO(agendamento.dataInicio) : DateTime.local(); // Use a data atual se undefined
//     // const endDate = agendamento.dataFim ? DateTime.fromISO(agendamento.dataFim) : DateTime.local(); // Use a data atual se undefined
//     const newEndDate = startDate.plus({ days: resizedDays }); // Nova data de fim calculada com base no redimensionamento

//     // Atualiza o agendamento para abranger os dias novos
//     for (let i = 0; i <= resizedDays; i++) {
//       const currentDay = startDate.plus({ days: i }).toISODate();

//       // Salve o agendamento em cada dia adicional
//       const newAgendamento = {
//         ...agendamento,
//         dataInicio: agendamento.dataInicio ?? undefined, // Converte 'null' para 'undefined'
//         dataFim: agendamento.dataFim ?? undefined, // Converte 'null' para 'undefined'
//       };

//       // Chama o serviço para salvar o agendamento
//       this.service.save(newAgendamento).subscribe(() => {
//         this.refreshCalendar();
//         this.snackBar.open('Agendamento atualizado com sucesso!', 'Fechar', { duration: 3000 });
//       });
//     }
//   }
// }



// onResizeEnd(event: ResizeEvent, agendamento: Agendamento): void {
//   // Captura a mudança de tamanho do redimensionamento nas bordas que você quer controlar (por ex., 'bottom')
//   const resizedDuration = event.edges.bottom
//     ? event.rectangle.height // Assumindo que o redimensionamento altera a altura
//     : 0; // Se não houver redimensionamento, atribui 0

//   // Verifica se agendamento.horaFim existe antes de processá-lo
//   if (agendamento.horaFim !== null && agendamento.horaFim !== undefined) {
//     // Atualiza a hora de fim com base no redimensionamento (por exemplo, altura em minutos)
//      DateTime.fromISO(agendamento.horaFim as string)
//       .plus({ minutes: resizedDuration }) // Garante que 'resizedDuration' é um número
//       .toISOTime();
//   } else {
//     // Define undefined se horaFim for null ou undefined
//     agendamento.horaFim = undefined;
//   }

//   // Salva o agendamento atualizado
//   this.service.save(agendamento).subscribe(() => {
//     this.snackBar.open('Agendamento atualizado com sucesso!', 'Fechar', { duration: 3000 });
//     this.refreshCalendar();
//   });
// }

// Função para recarregar os agendamentos e atualizar o calendário
refreshCalendar(): void {
  this.service.list().subscribe(agendamentos => {
    this.agendamentos2 = this.mapAgendamentosPorData(agendamentos); // Atualiza o estado dos agendamentos
  });
}

refresh(){
  this.agendamentos$ = this.service.list()
  .pipe(
    catchError(error => {
      this.onError();
      return of([])
    })
  );
}


private onError() {
  this.dialog.open(ErrorDialogComponent, {
    data: 'Erro ao tentar realisar agendamento .'
  });
}

onSubmit() {


  }



}
