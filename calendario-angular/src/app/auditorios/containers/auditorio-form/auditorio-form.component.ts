import { Component, computed, ElementRef, EventEmitter, Input, input, InputSignal, OnInit, Output, signal, Signal, ViewChild, WritableSignal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriosService } from '../../services/auditorios.service';

import { CommonModule, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarEvent } from 'angular-calendar';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import luxon, { DateTime } from 'luxon';
import { catchError, Observable, of } from 'rxjs';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { Pessoa } from '../../../pessoas/model/pessoa';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';

import { LoginService } from '../../../login/auth/login.service';
import { Auditorio } from '../../modelo/Auditorio';
import { AuditorioModalComponent } from './auditorio-modal/auditorio-modal.component';
import { Meetings } from './meetings.interface';




@Component({
    selector: 'app-auditorio-form',
    templateUrl: './auditorio-form.component.html',
    styleUrl: './auditorio-form.component.scss',
    standalone: true,
    imports: [
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    ResizableModule,
    DragAndDropModule,
    NgClass,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
],
})
export class AuditorioFormComponent implements OnInit {

// auditorios: any[] = [];

isAdmin: boolean = false;

isResizing: boolean = false;
startX: number = 0; // Coordenada inicial para calcular o redimensionamento

startResize(event: MouseEvent, auditorio: Auditorio) {
  this.isResizing = true;
  this.startX = event.clientX; // Captura a posição inicial do mouse
}

resizeEvent(event: MouseEvent, auditorio: Auditorio) {
  if (!this.isResizing) return;

  const distanceMoved = event.clientX - this.startX; // Calcula a distância movida
  const daysResized = Math.floor(distanceMoved / this.calendarCellWidth); // Converte a distância em dias

  if (daysResized > 0) {
    const newEndDate = DateTime.fromISO(auditorio.dataInicio || DateTime.local().toISODate()).plus({ days: daysResized });
    auditorio.dataFim = newEndDate.toISODate() ?? undefined;
  }
}

endResize(event: MouseEvent, auditorio: Auditorio) {
  if (this.isResizing) {
    this.isResizing = false;

    // Salva o auditorio atualizado com a nova dataFim
    this.service.save(auditorio).subscribe(() => {
      this.snackBar.open('Auditorio redimensionado com sucesso!', 'Fechar', { duration: 3000 });
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

  // onDragEnd(event: DropEvent<Auditorio>, newDay: DateTime, auditorio: Auditorio): void {
  //   event.event.stopPropagation(); // Previne a propagação do evento de clique

  //   if (auditorio && newDay) {
  //     auditorio.dataInicio = newDay.toISODate() ?? undefined;
  //     auditorio.dataFim = newDay.toISODate() ?? undefined;

  //     // Salva o auditorio atualizado sem abrir o modal
  //     this.service.save(auditorio).subscribe(() => {
  //       this.snackBar.open('Auditorio movido com sucesso!', 'Fechar', { duration: 3000 });
  //       this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
  //     });
  //   }
  // }


  // handleEventClick(dayOfMonth: DateTime, auditorio: Auditorio, event: MouseEvent): void {
  //   event.stopPropagation(); // Impede que o clique na célula acione o modal de criação
  //   this.openAuditorioModal(dayOfMonth, auditorio); // Abra o modal apenas para edição
  // }


  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  auditorio!: Auditorio;

  auditorios$!: Observable<Auditorio[]>;

  @Input() auditorios2: { [key: string]: Auditorio[] } = {}; // Inicializa com um objeto vazio

  auditorios: InputSignal<Meetings> = input.required();
  hoje: Signal<DateTime> = signal(DateTime.local());
  primeiroDiaDoMesAtivo: WritableSignal<DateTime> = signal(
    this.hoje().startOf('month'),
  );

  // handleDateClick(event: any) {
  //   this.auditorio = {id:0, pessoa:{_id:'', identidade:'', users:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', acesso:'', dataUltimaPromocao:0, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0}, ramal:'', caminho:'',  }, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0} }; // Limpar o objeto
  //   // this.displayModal = true;
  // }

  // handleEventClick(event: any) {
  //   this.auditorio = { ...event.data }; // Preencher com dados do evento
  //   // this.openAuditorioModal = true;
  // }

  onEventResize(event: any) {
    this.auditorio.dataInicio = event.newStart;
    this.auditorio.dataFim = event.newEnd;
    this.service.save(this.auditorio);
  }

  onEventDrop(event: any) {
    this.auditorio.dataInicio = event.newStart; // Atualizar com a nova data
    this.service.save(this.auditorio);
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

    // // Adiciona todos os dias do mês atual (inclusive o último dia)
    // let current = startOfCurrentMonth;
    // while (current <= endOfCurrentMonth) {
    //   days.push(current);
    //   current = current.plus({ days: 1 });
    // }

    // Adiciona dias do mês seguinte para completar a última semana até atingir 35 dias
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfCurrentMonth.plus({ days: i }));
    }

    return days.slice(0, 42); // Retorna exatamente 35 dias
  });

  // daysOfMonth(): DateTime[] {
  //   const primeiroDia = this.primeiroDiaDoMesAtivo().startOf('month');
  //   const ultimoDia = this.primeiroDiaDoMesAtivo().endOf('month');

  //   // Começa na semana do primeiro dia do mês (domingo)
  //   const inicioGrade = primeiroDia.startOf('week');

  //   // Termina no final da semana do último dia do mês (sábado)
  //   const fimGrade = ultimoDia.endOf('week');

  //   const dias: DateTime[] = [];
  //   let atual = inicioGrade;

  //   while (atual <= fimGrade) {
  //     dias.push(atual);
  //     atual = atual.plus({ days: 1 });
  //   }

  //   return dias;
  // }

  // daysOfMonth: Signal<DateTime[]> = computed(() => {
  //   const startOfCurrentMonth = this.primeiroDiaDoMesAtivo().startOf('month');
  //   const endOfCurrentMonth = this.primeiroDiaDoMesAtivo().endOf('month').startOf('day');

  //   const startOfWeek = startOfCurrentMonth.weekday;
  //   let days: DateTime[] = [];

  //   // Dias do mês anterior para preencher a primeira linha
  //   if (startOfWeek !== 7) {
  //     const daysFromPreviousMonth = startOfCurrentMonth.minus({ days: startOfWeek });
  //     for (let i = 0; i < startOfWeek; i++) {
  //       days.push(daysFromPreviousMonth.plus({ days: i }));
  //     }
  //   }

  //   // ✅ Corrigido: adiciona todos os dias do mês, inclusive o último
  //   let current = startOfCurrentMonth;
  //   while (current <= endOfCurrentMonth) {
  //     days.push(current);
  //     current = current.plus({ days: 1 });
  //   }

  //   // Dias do mês seguinte para completar 35 dias
  //   const remainingDays = 35 - days.length;
  //   for (let i = 1; i <= remainingDays; i++) {
  //     days.push(endOfCurrentMonth.plus({ days: i }));
  //   }

  //   return days.slice(0, 35);
  // });





  DATE_MED = DateTime.DATE_MED;

  activeDayMeetings: Signal<any[]> = computed(() => {
    const activeDay = this.diaAtivo();
    if (activeDay === null) {
      return [];
    }
    const  activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      return [];
    }

    return this.auditorios2[activeDayISO]?.map(auditorio => ({
      horaInicio: auditorio.horaInicio ? DateTime.fromISO(auditorio.horaInicio).toFormat('HH:mm') : 'N/A',
      horaFim: auditorio.horaFim ? DateTime.fromISO(auditorio.horaFim).toFormat('HH:mm') : 'N/A',
      assessoria: auditorio.assessoria
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

  getAuditoriosForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) {
      return []; // Retorna uma lista vazia se dayISO for null
    }

    // Verificar e depurar se os auditorios estão sendo encontrados
    const auditorios = Object.values(this.auditorios2).flat(); // Obtém todos os auditorios
    const renderedAuditorios: any[] = [];

    return auditorios.filter(auditorio => {
      const dataInicio = auditorio.dataInicio ? DateTime.fromISO(auditorio.dataInicio).toISODate() : null;
      const dataFim = auditorio.dataFim ? DateTime.fromISO(auditorio.dataFim).toISODate() : null;

      // Verifica se o dia atual está no intervalo entre dataInicio e dataFim
    if (dataInicio && dataFim && DateTime.fromISO(dayISO) >= DateTime.fromISO(dataInicio) && DateTime.fromISO(dayISO) <= DateTime.fromISO(dataFim)) {
      // Adiciona o auditorio apenas se ele ainda não foi renderizado nesta célula
      if (!renderedAuditorios.find(a => a.id === auditorio.id)) {
        renderedAuditorios.push(auditorio);
        return true;
      }
    }
    return false;
  });
  }


  // getAuditoriosForDay(day: DateTime): any[] {
  //   const dayISO = day.toISODate();
  //   if (!dayISO) {
  //     return []; // Retorna uma lista vazia se dayISO for null
  //   }

  //   // Verificar e depurar se os auditorios estão sendo encontrados
  //   const auditorios = this.auditorios2[dayISO] || [];
  //   // console.log(`Auditorios para ${dayISO}:`, auditorios);
  //   return auditorios.map(auditorio => {
  //     const horaInicio = auditorio.horaInicio ? DateTime.fromISO(auditorio.horaInicio).toFormat('HH:mm') : 'N/A';
  //     const horaFim = auditorio.horaFim ? DateTime.fromISO(auditorio.horaFim).toFormat('HH:mm') : 'N/A';

  //     return {
  //       // Preenche o modal para edição, quando clicado em um agengamento existente a partir do calendário
  //       id: auditorio.id,
  //       dataInicio: auditorio.dataInicio,
  //       dataFim: auditorio.dataFim,
  //       horaInicio: auditorio.horaInicio,
  //       horaFim: auditorio.horaFim,
  //       pessoa: auditorio.pessoa,
  //       assessoria: auditorio.assessoria,
  //       acessorios: auditorio.acessorios,
  //       audiencia: auditorio.audiencia,
  //       evento: auditorio.evento,
  //       diex: auditorio.diex,
  //       militarLigacao: auditorio.militarLigacao


  //     };
  //   });
  // }

  isAuditorioValido(auditorio: any, day: DateTime): boolean {
    const auditoriosDoDia = this.getAuditoriosForDay(day);
    const horaInicioNovo = DateTime.fromISO(auditorio.horaInicio);
    const horaFimNovo = DateTime.fromISO(auditorio.horaFim);

    for (const ag of auditoriosDoDia) {
      const horaInicioExistente = DateTime.fromISO(ag.horaInicio);
      const horaFimExistente = DateTime.fromISO(ag.horaFim);

      // Verifica se o novo auditorio não está dentro do intervalo de um auditorio existente
      if (
        (horaInicioNovo < horaFimExistente && horaInicioNovo >= horaInicioExistente) ||
        (horaFimNovo > horaInicioExistente && horaFimNovo <= horaFimExistente)
      ) {
        return false; // Auditorio inválido
      }
    }

    return true; // Auditorio válido
  }

  form: UntypedFormGroup;
  pessoas: Pessoa[] = [];
  assessorias: Assessoria[] = [];

  days: any;

  @Output() add = new EventEmitter(false);

  constructor( private readonly http: HttpClient,

    private readonly formBuilder: UntypedFormBuilder,
    private readonly service: AuditoriosService,
    private loginService: LoginService,
    // private auditorioModalService: AuditorioModalService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private auditorioService: AuditoriosService,


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
  // Carrega os auditorios do servidor
  this.loadAuditorios();

  // Verifique o papel do usuário (você pode obter isso de um serviço de autenticação)
  this.isAdmin = this.loginService.hasPermission('ROLE_ADMINISTRADOR') || this.loginService.hasPermission('ROLE_AGENDAMENTO');

}

loadAuditorios(): void {

  this.auditorioService.list().subscribe((data: any[]) => {
    this.auditorios2 = this.mapAuditoriosPorData(data);
    console.log('Auditorios carregados:', this.auditorios2); // Adicione este log
   });

}

// Mapeia os auditorios por data
mapAuditoriosPorData(auditorios: Auditorio[]): { [key: string]: Auditorio[] } {
  const auditoriosMap: { [key: string]: Auditorio[] } = {};

  auditorios.forEach(auditorio => {
    if (auditorio.dataInicio && auditorio.dataFim) {
      const dataInicio = DateTime.fromISO(auditorio.dataInicio);
      const dataFim = DateTime.fromISO(auditorio.dataFim);

      // Itera sobre cada dia entre dataInicio e dataFim
      for (let day = dataInicio; day <= dataFim; day = day.plus({ days: 1 })) {
        const dayISO = day.toISODate();

        // Certifique-se de que o auditorio não está sendo duplicado no mesmo dia
        if (dayISO && !auditoriosMap[dayISO]?.some(a => a.id === auditorio.id)) {
          if (!auditoriosMap[dayISO]) {
            auditoriosMap[dayISO] = [];
          }
          auditoriosMap[dayISO].push(auditorio);
        }
      }
    }
  });

  return auditoriosMap;
}




// openAuditorioModal(day: DateTime, auditorio?: Auditorio): void {
//   const dataToPass = auditorio
//     ? { // Se houver um auditorio, passa os dados para edição
//         date: day.toISODate(),
//         auditorio: auditorio
//       }
//     : { // Caso contrário, passa um objeto vazio para criação
//         date: day.toISODate(),
//         auditorio: null
//       };

//   const dialogRef = this.dialog.open(AuditorioModalComponent, {
//     width: '600px',
//     data: dataToPass
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       // Se houver resultado, processa o resultado
//       if (auditorio) {
//         // Aqui você atualiza o auditorio existente
//         Object.assign(auditorio, result);
//       } else {
//         // Aqui você cria um novo auditorio
//         this.service.save(result).subscribe(() => {
//           this.refreshCalendar();
//           });
//       }
//     }
//   });
// }

openAuditorioModal(day: DateTime, auditorio?: Auditorio): void {
  // Se o auditorio for passado, abrir o modal preenchido para edição
  if (auditorio) {
    const dialogRef = this.dialog.open(AuditorioModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        auditorio: auditorio  // Passa o auditorio para ser editado
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualiza o auditorio existente
        Object.assign(auditorio, result);
        this.service.save(auditorio).subscribe(() => {
          this.refreshCalendar();
          this.loadAuditorios(); // Recarrega os dados após a confirmação
        });
      }
    });
  } else {
    // Se não houver auditorio, abrir o modal vazio para criar um novo auditorio
    const dialogRef = this.dialog.open(AuditorioModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        auditorio: null  // Passa null para indicar que é um novo auditorio
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adiciona o novo auditorio
        this.service.save(result).subscribe(() => {
          this.refreshCalendar();
          this.loadAuditorios(); // Recarrega os dados após a confirmação
        });
      }
    });
  }
}


addNewEvent(): void {
  const dialogRef = this.dialog.open(AuditorioModalComponent, {
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
  const dialogRef = this.dialog.open(AuditorioModalComponent, {
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
  const auditorio = event.dropData as Auditorio;

  if (auditorio && newDay) {
    // A lógica de mover o evento é simples, apenas atualizamos a data de início e fim mantendo a duração original
    const dataInicioOriginal = auditorio.dataInicio ? DateTime.fromISO(auditorio.dataInicio) : DateTime.local();
    const dataFimOriginal = auditorio.dataFim ? DateTime.fromISO(auditorio.dataFim) : dataInicioOriginal;

    // Calcula a duração original do auditorio
    const originalDuration = dataFimOriginal.diff(dataInicioOriginal, 'days').days;

    // Atualiza a data de início para a nova data (nova posição)
    auditorio.dataInicio = newDay.toISODate() ?? undefined;

    // Atualiza a data de fim com base na duração original
    auditorio.dataFim = newDay.plus({ days: originalDuration }).toISODate() ?? undefined;

    // Salva o auditorio movido
    this.service.save(auditorio).subscribe(() => {
      this.snackBar.open('Auditorio movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
    });
  }
}



// onDrop(event: DropEvent, newDay: DateTime): void {
//   const auditorio = event.dropData as Auditorio;

//   if (auditorio && newDay) {
//     // Atualiza a data de início e fim do auditorio para o novo dia
//     auditorio.dataInicio = newDay.toISODate() ?? undefined;  // Atualiza a data do auditorio
//     auditorio.dataFim = newDay.toISODate() ?? undefined;  // Atualiza a data do auditorio

//     // Atualize a hora de início e fim, se necessário. Você pode manter o mesmo horário
//     // ou ajustar de acordo com a necessidade do seu sistema.

//     this.service.save(auditorio).subscribe(() => {
//       this.snackBar.open('Auditorio movido com sucesso!', 'Fechar', { duration: 3000 });
//       this.refreshCalendar();  // Atualiza o calendário para refletir as mudanças
//     });
//   }
// }

calendarCellWidth: number = 100; // Suponha que você conheça a largura de cada célula de dia

onResizeEnd(event: ResizeEvent, auditorio: Auditorio): void {
  // Certifique-se de que o redimensionamento está ocorrendo na borda direita
  if (event.edges.right) {
    // Calcule a quantidade de dias redimensionados
    const resizedDays = Math.round((event.rectangle.width ?? 0) / this.calendarCellWidth);

    if (resizedDays > 0) {
      const dataInicio = auditorio.dataInicio ? DateTime.fromISO(auditorio.dataInicio) : DateTime.local();

      // A nova data de fim é calculada com base nos dias redimensionados
      const newEndDate = dataInicio.plus({ days: resizedDays });

      // Atualiza a data de fim com base no redimensionamento
      auditorio.dataFim = newEndDate.toISODate() ?? undefined;

      // Salva o auditorio atualizado
      this.service.save(auditorio).subscribe(() => {
        this.snackBar.open('Auditorio redimensionado com sucesso!', 'Fechar', { duration: 3000 });
        this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
      });
    }
  }
}

handleDrop(event: DropEvent<Auditorio>, newDay: DateTime): void {
  const auditorio = event.dropData;

  if (auditorio && newDay) {
    // Atualiza as datas de início e fim para a nova data
    auditorio.dataInicio = newDay.toISODate() ?? undefined;
    auditorio.dataFim = newDay.toISODate() ?? undefined;

    // Salvar o auditorio atualizado
    this.service.save(auditorio).subscribe(() => {
      this.snackBar.open('Auditorio movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar();  // Atualiza o calendário
    });
  }
}






// onResizeEnd(event: ResizeEvent, auditorio: Auditorio): void {

//   console.log('Evento de redimensionamento:', event);

//   // Calcule a quantidade de dias que o evento foi redimensionado
//   const resizedDays = Math.ceil((event.rectangle.width ?? 0) / this.calendarCellWidth); // Assuma que você tenha uma variável 'calendarCellWidth'

//   if (resizedDays > 0) {
//     const startDate = auditorio.dataInicio ? DateTime.fromISO(auditorio.dataInicio) : DateTime.local(); // Use a data atual se undefined
//     // const endDate = auditorio.dataFim ? DateTime.fromISO(auditorio.dataFim) : DateTime.local(); // Use a data atual se undefined
//     const newEndDate = startDate.plus({ days: resizedDays }); // Nova data de fim calculada com base no redimensionamento

//     // Atualiza o auditorio para abranger os dias novos
//     for (let i = 0; i <= resizedDays; i++) {
//       const currentDay = startDate.plus({ days: i }).toISODate();

//       // Salve o auditorio em cada dia adicional
//       const newAuditorio = {
//         ...auditorio,
//         dataInicio: auditorio.dataInicio ?? undefined, // Converte 'null' para 'undefined'
//         dataFim: auditorio.dataFim ?? undefined, // Converte 'null' para 'undefined'
//       };

//       // Chama o serviço para salvar o auditorio
//       this.service.save(newAuditorio).subscribe(() => {
//         this.refreshCalendar();
//         this.snackBar.open('Auditorio atualizado com sucesso!', 'Fechar', { duration: 3000 });
//       });
//     }
//   }
// }



// onResizeEnd(event: ResizeEvent, auditorio: Auditorio): void {
//   // Captura a mudança de tamanho do redimensionamento nas bordas que você quer controlar (por ex., 'bottom')
//   const resizedDuration = event.edges.bottom
//     ? event.rectangle.height // Assumindo que o redimensionamento altera a altura
//     : 0; // Se não houver redimensionamento, atribui 0

//   // Verifica se auditorio.horaFim existe antes de processá-lo
//   if (auditorio.horaFim !== null && auditorio.horaFim !== undefined) {
//     // Atualiza a hora de fim com base no redimensionamento (por exemplo, altura em minutos)
//      DateTime.fromISO(auditorio.horaFim as string)
//       .plus({ minutes: resizedDuration }) // Garante que 'resizedDuration' é um número
//       .toISOTime();
//   } else {
//     // Define undefined se horaFim for null ou undefined
//     auditorio.horaFim = undefined;
//   }

//   // Salva o auditorio atualizado
//   this.service.save(auditorio).subscribe(() => {
//     this.snackBar.open('Auditorio atualizado com sucesso!', 'Fechar', { duration: 3000 });
//     this.refreshCalendar();
//   });
// }

// Função para recarregar os auditorios e atualizar o calendário
refreshCalendar(): void {
  this.service.list().subscribe(auditorios => {
    this.auditorios2 = this.mapAuditoriosPorData(auditorios); // Atualiza o estado dos auditorios
  });
}

refresh(){
  this.auditorios$ = this.service.list()
  .pipe(
    catchError(error => {
      this.onError();
      return of([])
    })
  );
}


private onError() {
  this.dialog.open(ErrorDialogComponent, {
    data: 'Erro ao tentar realisar auditorio .'
  });
}

onSubmit() {


  }



}
