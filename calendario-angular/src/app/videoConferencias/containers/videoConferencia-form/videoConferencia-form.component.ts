import { Component, computed, ElementRef, EventEmitter, Input, input, InputSignal, OnInit, Output, signal, Signal, ViewChild, WritableSignal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { VideoConferenciasService } from '../../services/videoConferencias.service';

import { Location, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarEvent } from 'angular-calendar';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { DateTime } from 'luxon';
import { catchError, Observable, of } from 'rxjs';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { Pessoa } from '../../../pessoas/model/pessoa';
import { PessoasService } from '../../../pessoas/services/pessoas.service';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { VideoConferencia } from '../../modelo/VideoConferencia';
import { VideoConferenciaModalComponent } from './videoConferencia-modal/videoConferencia-modal.component';
import { Meetings } from './meetings.interface';


@Component({
    selector: 'app-videoConferencia-form',
    templateUrl: './videoConferencia-form.component.html',
    styleUrl: './videoConferencia-form.component.scss',
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
export class VideoConferenciaFormComponent implements OnInit {

isResizing: boolean = false;
startX: number = 0; // Coordenada inicial para calcular o redimensionamento

startResize(event: MouseEvent, videoConferencia: VideoConferencia) {
  this.isResizing = true;
  this.startX = event.clientX; // Captura a posição inicial do mouse
}

resizeEvent(event: MouseEvent, videoConferencia: VideoConferencia) {
  if (!this.isResizing) return;

  const distanceMoved = event.clientX - this.startX; // Calcula a distância movida
  const daysResized = Math.floor(distanceMoved / this.calendarCellWidth); // Converte a distância em dias

  if (daysResized > 0) {
    const newEndDate = DateTime.fromISO(videoConferencia.dataInicio || DateTime.local().toISODate()).plus({ days: daysResized });
    videoConferencia.dataFim = newEndDate.toISODate() ?? undefined;
  }
}

endResize(event: MouseEvent, videoConferencia: VideoConferencia) {
  if (this.isResizing) {
    this.isResizing = false;

    // Salva o videoConferencia atualizado com a nova dataFim
    this.videoConferenciasService.save(videoConferencia).subscribe(() => {
      this.snackBar.open('VideoConferencia redimensionado com sucesso!', 'Fechar', { duration: 3000 });
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

  // onDragEnd(event: DropEvent<VideoConferencia>, newDay: DateTime, videoConferencia: VideoConferencia): void {
  //   event.event.stopPropagation(); // Previne a propagação do evento de clique

  //   if (videoConferencia && newDay) {
  //     videoConferencia.dataInicio = newDay.toISODate() ?? undefined;
  //     videoConferencia.dataFim = newDay.toISODate() ?? undefined;

  //     // Salva o videoConferencia atualizado sem abrir o modal
  //     this.service.save(videoConferencia).subscribe(() => {
  //       this.snackBar.open('VideoConferencia movido com sucesso!', 'Fechar', { duration: 3000 });
  //       this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
  //     });
  //   }
  // }


  // handleEventClick(dayOfMonth: DateTime, videoConferencia: VideoConferencia, event: MouseEvent): void {
  //   event.stopPropagation(); // Impede que o clique na célula acione o modal de criação
  //   this.openVideoConferenciaModal(dayOfMonth, videoConferencia); // Abra o modal apenas para edição
  // }


  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  videoConferencia!: VideoConferencia;

  videoConferencias$!: Observable<VideoConferencia[]>;

  @Input() videoConferencias2: { [key: string]: VideoConferencia[] } = {}; // Inicializa com um objeto vazio

  videoConferencias: InputSignal<Meetings> = input.required();
  hoje: Signal<DateTime> = signal(DateTime.local());
  primeiroDiaDoMesAtivo: WritableSignal<DateTime> = signal(
    this.hoje().startOf('month'),
  );

  // handleDateClick(event: any) {
  //   this.videoConferencia = {id:0, pessoa:{_id:'', identidade:'', users:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', acesso:'', dataUltimaPromocao:0, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0}, ramal:'', caminho:'',  }, assessoria:{_id:'', sigla:'', descricao:'', interna:true, ordem:0} }; // Limpar o objeto
  //   // this.displayModal = true;
  // }

  // handleEventClick(event: any) {
  //   this.videoConferencia = { ...event.data }; // Preencher com dados do evento
  //   // this.openVideoConferenciaModal = true;
  // }

  onEventResize(event: any) {
    this.videoConferencia.dataInicio = event.newStart;
    this.videoConferencia.dataFim = event.newEnd;
    this.videoConferenciasService.save(this.videoConferencia);
  }

  onEventDrop(event: any) {
    this.videoConferencia.dataInicio = event.newStart; // Atualizar com a nova data
    this.videoConferenciasService.save(this.videoConferencia);
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

    return this.videoConferencias2[activeDayISO]?.map(videoConferencia => ({
      horaInicio: videoConferencia.horaInicio ? DateTime.fromISO(videoConferencia.horaInicio).toFormat('HH:mm') : 'N/A',
      horaFim: videoConferencia.horaFim ? DateTime.fromISO(videoConferencia.horaFim).toFormat('HH:mm') : 'N/A',
      assessoria: videoConferencia.assessoria
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

  getVideoConferenciasForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) {
      return []; // Retorna uma lista vazia se dayISO for null
    }

    // Verificar e depurar se os videoConferencias estão sendo encontrados
    const videoConferencias = Object.values(this.videoConferencias2).flat(); // Obtém todos os videoConferencias
    const renderedVideoConferencias: any[] = [];

    return videoConferencias.filter(videoConferencia => {
      const dataInicio = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio).toISODate() : null;
      const dataFim = videoConferencia.dataFim ? DateTime.fromISO(videoConferencia.dataFim).toISODate() : null;

      // Verifica se o dia atual está no intervalo entre dataInicio e dataFim
    if (dataInicio && dataFim && DateTime.fromISO(dayISO) >= DateTime.fromISO(dataInicio) && DateTime.fromISO(dayISO) <= DateTime.fromISO(dataFim)) {
      // Adiciona o videoConferencia apenas se ele ainda não foi renderizado nesta célula
      if (!renderedVideoConferencias.find(a => a.id === videoConferencia.id)) {
        renderedVideoConferencias.push(videoConferencia);
        return true;
      }
    }
    return false;
  });
  }


  // getVideoConferenciasForDay(day: DateTime): any[] {
  //   const dayISO = day.toISODate();
  //   if (!dayISO) {
  //     return []; // Retorna uma lista vazia se dayISO for null
  //   }

  //   // Verificar e depurar se os videoConferencias estão sendo encontrados
  //   const videoConferencias = this.videoConferencias2[dayISO] || [];
  //   // console.log(`VideoConferencias para ${dayISO}:`, videoConferencias);
  //   return videoConferencias.map(videoConferencia => {
  //     const horaInicio = videoConferencia.horaInicio ? DateTime.fromISO(videoConferencia.horaInicio).toFormat('HH:mm') : 'N/A';
  //     const horaFim = videoConferencia.horaFim ? DateTime.fromISO(videoConferencia.horaFim).toFormat('HH:mm') : 'N/A';

  //     return {
  //       // Preenche o modal para edição, quando clicado em um agengamento existente a partir do calendário
  //       id: videoConferencia.id,
  //       dataInicio: videoConferencia.dataInicio,
  //       dataFim: videoConferencia.dataFim,
  //       horaInicio: videoConferencia.horaInicio,
  //       horaFim: videoConferencia.horaFim,
  //       pessoa: videoConferencia.pessoa,
  //       assessoria: videoConferencia.assessoria,
  //       acessorios: videoConferencia.acessorios,
  //       audiencia: videoConferencia.audiencia,
  //       evento: videoConferencia.evento,
  //       diex: videoConferencia.diex,
  //       militarLigacao: videoConferencia.militarLigacao


  //     };
  //   });
  // }

  isVideoConferenciaValido(videoConferencia: any, day: DateTime): boolean {
    const videoConferenciasDoDia = this.getVideoConferenciasForDay(day);
    const horaInicioNovo = DateTime.fromISO(videoConferencia.horaInicio);
    const horaFimNovo = DateTime.fromISO(videoConferencia.horaFim);

    for (const ag of videoConferenciasDoDia) {
      const horaInicioExistente = DateTime.fromISO(ag.horaInicio);
      const horaFimExistente = DateTime.fromISO(ag.horaFim);

      // Verifica se o novo videoConferencia não está dentro do intervalo de um videoConferencia existente
      if (
        (horaInicioNovo < horaFimExistente && horaInicioNovo >= horaInicioExistente) ||
        (horaFimNovo > horaInicioExistente && horaFimNovo <= horaFimExistente)
      ) {
        return false; // VideoConferencia inválido
      }
    }

    return true; // VideoConferencia válido
  }

  form: UntypedFormGroup;
  pessoas: Pessoa[] = [];
  assessorias: Assessoria[] = [];

  days: any;

  @Output() add = new EventEmitter(false);

  constructor( private readonly http: HttpClient,
    private readonly formBuilder: UntypedFormBuilder,
    private  videoConferenciasService: VideoConferenciasService,
    // private videoConferenciaModalService: VideoConferenciaModalService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly assessoriasService: AssessoriasService,
    private readonly pessoasService: PessoasService,

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
  // Carrega os videoConferencias do servidor
  this.http.get<VideoConferencia[]>('/api/videoConferencias').subscribe(dataInicio => {
    this.videoConferencias2 = this.mapVideoConferenciasPorData(dataInicio);
    console.log('VideoConferencias carregados:', this.videoConferencias2); // Adicione este log
  });

}

// Mapeia os videoConferencias por data
mapVideoConferenciasPorData(videoConferencias: VideoConferencia[]): { [key: string]: VideoConferencia[] } {
  const videoConferenciasMap: { [key: string]: VideoConferencia[] } = {};

  videoConferencias.forEach(videoConferencia => {
    if (videoConferencia.dataInicio && videoConferencia.dataFim) {
      const dataInicio = DateTime.fromISO(videoConferencia.dataInicio);
      const dataFim = DateTime.fromISO(videoConferencia.dataFim);

      // Itera sobre cada dia entre dataInicio e dataFim
      for (let day = dataInicio; day <= dataFim; day = day.plus({ days: 1 })) {
        const dayISO = day.toISODate();

        // Certifique-se de que o videoConferencia não está sendo duplicado no mesmo dia
        if (dayISO && !videoConferenciasMap[dayISO]?.some(a => a.id === videoConferencia.id)) {
          if (!videoConferenciasMap[dayISO]) {
            videoConferenciasMap[dayISO] = [];
          }
          videoConferenciasMap[dayISO].push(videoConferencia);
        }
      }
    }
  });

  return videoConferenciasMap;
}




// openVideoConferenciaModal(day: DateTime, videoConferencia?: VideoConferencia): void {
//   const dataToPass = videoConferencia
//     ? { // Se houver um videoConferencia, passa os dados para edição
//         date: day.toISODate(),
//         videoConferencia: videoConferencia
//       }
//     : { // Caso contrário, passa um objeto vazio para criação
//         date: day.toISODate(),
//         videoConferencia: null
//       };

//   const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
//     width: '600px',
//     data: dataToPass
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       // Se houver resultado, processa o resultado
//       if (videoConferencia) {
//         // Aqui você atualiza o videoConferencia existente
//         Object.assign(videoConferencia, result);
//       } else {
//         // Aqui você cria um novo videoConferencia
//         this.service.save(result).subscribe(() => {
//           this.refreshCalendar();
//           });
//       }
//     }
//   });
// }

openVideoConferenciaModal(day: DateTime, videoConferencia?: VideoConferencia): void {
  // Se o videoConferencia for passado, abrir o modal preenchido para edição
  if (videoConferencia) {
    const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        videoConferencia: videoConferencia  // Passa o videoConferencia para ser editado
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualiza o videoConferencia existente
        Object.assign(videoConferencia, result);
        this.videoConferenciasService.save(videoConferencia).subscribe(() => {
          this.refreshCalendar();
        });
      }
    });
  } else {
    // Se não houver videoConferencia, abrir o modal vazio para criar um novo videoConferencia
    const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
      width: '600px',
      data: {
        date: day.toISODate(),
        videoConferencia: null  // Passa null para indicar que é um novo videoConferencia
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adiciona o novo videoConferencia
        this.videoConferenciasService.save(result).subscribe(() => {
          this.refreshCalendar();
        });
      }
    });
  }
}


addNewEvent(): void {
  const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
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
  const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
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
  const videoConferencia = event.dropData as VideoConferencia;

  if (videoConferencia && newDay) {
    // A lógica de mover o evento é simples, apenas atualizamos a data de início e fim mantendo a duração original
    const dataInicioOriginal = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio) : DateTime.local();
    const dataFimOriginal = videoConferencia.dataFim ? DateTime.fromISO(videoConferencia.dataFim) : dataInicioOriginal;

    // Calcula a duração original do videoConferencia
    const originalDuration = dataFimOriginal.diff(dataInicioOriginal, 'days').days;

    // Atualiza a data de início para a nova data (nova posição)
    videoConferencia.dataInicio = newDay.toISODate() ?? undefined;

    // Atualiza a data de fim com base na duração original
    videoConferencia.dataFim = newDay.plus({ days: originalDuration }).toISODate() ?? undefined;

    // Salva o videoConferencia movido
    this.videoConferenciasService.save(videoConferencia).subscribe(() => {
      this.snackBar.open('VideoConferencia movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
    });
  }
}



// onDrop(event: DropEvent, newDay: DateTime): void {
//   const videoConferencia = event.dropData as VideoConferencia;

//   if (videoConferencia && newDay) {
//     // Atualiza a data de início e fim do videoConferencia para o novo dia
//     videoConferencia.dataInicio = newDay.toISODate() ?? undefined;  // Atualiza a data do videoConferencia
//     videoConferencia.dataFim = newDay.toISODate() ?? undefined;  // Atualiza a data do videoConferencia

//     // Atualize a hora de início e fim, se necessário. Você pode manter o mesmo horário
//     // ou ajustar de acordo com a necessidade do seu sistema.

//     this.service.save(videoConferencia).subscribe(() => {
//       this.snackBar.open('VideoConferencia movido com sucesso!', 'Fechar', { duration: 3000 });
//       this.refreshCalendar();  // Atualiza o calendário para refletir as mudanças
//     });
//   }
// }

calendarCellWidth: number = 100; // Suponha que você conheça a largura de cada célula de dia

onResizeEnd(event: ResizeEvent, videoConferencia: VideoConferencia): void {
  // Certifique-se de que o redimensionamento está ocorrendo na borda direita
  if (event.edges.right) {
    // Calcule a quantidade de dias redimensionados
    const resizedDays = Math.round((event.rectangle.width ?? 0) / this.calendarCellWidth);

    if (resizedDays > 0) {
      const dataInicio = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio) : DateTime.local();

      // A nova data de fim é calculada com base nos dias redimensionados
      const newEndDate = dataInicio.plus({ days: resizedDays });

      // Atualiza a data de fim com base no redimensionamento
      videoConferencia.dataFim = newEndDate.toISODate() ?? undefined;

      // Salva o videoConferencia atualizado
      this.videoConferenciasService.save(videoConferencia).subscribe(() => {
        this.snackBar.open('VideoConferencia redimensionado com sucesso!', 'Fechar', { duration: 3000 });
        this.refreshCalendar(); // Atualiza o calendário para refletir as mudanças
      });
    }
  }
}

handleDrop(event: DropEvent<VideoConferencia>, newDay: DateTime): void {
  const videoConferencia = event.dropData;

  if (videoConferencia && newDay) {
    // Atualiza as datas de início e fim para a nova data
    videoConferencia.dataInicio = newDay.toISODate() ?? undefined;
    videoConferencia.dataFim = newDay.toISODate() ?? undefined;

    // Salvar o videoConferencia atualizado
    this.videoConferenciasService.save(videoConferencia).subscribe(() => {
      this.snackBar.open('VideoConferencia movido com sucesso!', 'Fechar', { duration: 3000 });
      this.refreshCalendar();  // Atualiza o calendário
    });
  }
}






// onResizeEnd(event: ResizeEvent, videoConferencia: VideoConferencia): void {

//   console.log('Evento de redimensionamento:', event);

//   // Calcule a quantidade de dias que o evento foi redimensionado
//   const resizedDays = Math.ceil((event.rectangle.width ?? 0) / this.calendarCellWidth); // Assuma que você tenha uma variável 'calendarCellWidth'

//   if (resizedDays > 0) {
//     const startDate = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio) : DateTime.local(); // Use a data atual se undefined
//     // const endDate = videoConferencia.dataFim ? DateTime.fromISO(videoConferencia.dataFim) : DateTime.local(); // Use a data atual se undefined
//     const newEndDate = startDate.plus({ days: resizedDays }); // Nova data de fim calculada com base no redimensionamento

//     // Atualiza o videoConferencia para abranger os dias novos
//     for (let i = 0; i <= resizedDays; i++) {
//       const currentDay = startDate.plus({ days: i }).toISODate();

//       // Salve o videoConferencia em cada dia adicional
//       const newVideoConferencia = {
//         ...videoConferencia,
//         dataInicio: videoConferencia.dataInicio ?? undefined, // Converte 'null' para 'undefined'
//         dataFim: videoConferencia.dataFim ?? undefined, // Converte 'null' para 'undefined'
//       };

//       // Chama o serviço para salvar o videoConferencia
//       this.service.save(newVideoConferencia).subscribe(() => {
//         this.refreshCalendar();
//         this.snackBar.open('VideoConferencia atualizado com sucesso!', 'Fechar', { duration: 3000 });
//       });
//     }
//   }
// }



// onResizeEnd(event: ResizeEvent, videoConferencia: VideoConferencia): void {
//   // Captura a mudança de tamanho do redimensionamento nas bordas que você quer controlar (por ex., 'bottom')
//   const resizedDuration = event.edges.bottom
//     ? event.rectangle.height // Assumindo que o redimensionamento altera a altura
//     : 0; // Se não houver redimensionamento, atribui 0

//   // Verifica se videoConferencia.horaFim existe antes de processá-lo
//   if (videoConferencia.horaFim !== null && videoConferencia.horaFim !== undefined) {
//     // Atualiza a hora de fim com base no redimensionamento (por exemplo, altura em minutos)
//      DateTime.fromISO(videoConferencia.horaFim as string)
//       .plus({ minutes: resizedDuration }) // Garante que 'resizedDuration' é um número
//       .toISOTime();
//   } else {
//     // Define undefined se horaFim for null ou undefined
//     videoConferencia.horaFim = undefined;
//   }

//   // Salva o videoConferencia atualizado
//   this.service.save(videoConferencia).subscribe(() => {
//     this.snackBar.open('VideoConferencia atualizado com sucesso!', 'Fechar', { duration: 3000 });
//     this.refreshCalendar();
//   });
// }

// Função para recarregar os videoConferencias e atualizar o calendário
refreshCalendar(): void {
  this.videoConferenciasService.list().subscribe(videoConferencias => {
    this.videoConferencias2 = this.mapVideoConferenciasPorData(videoConferencias); // Atualiza o estado dos videoConferencias
  });
}

refresh(){
  this.videoConferencias$ = this.videoConferenciasService.list()
  .pipe(
    catchError(error => {
      this.onError();
      return of([])
    })
  );
}


private onError() {
  this.dialog.open(ErrorDialogComponent, {
    data: 'Erro ao tentar realisar videoConferencia .'
  });
}

onSubmit() {


  }



}
