import { Component, computed, EventEmitter, Input, input, InputSignal, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoConferenciasService } from '../../services/videoConferencias.service';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { Pessoa } from '../../../pessoas/model/pessoa';
import { VideoConferencia } from '../../modelo/VideoConferencia';
import { VideoConferenciaModalComponent } from './videoConferencia-modal/videoConferencia-modal.component';
import { Meetings } from './meetings.interface';
import { LoginService } from '../../../login/auth/login.service';
import { PessoasService } from '../../../pessoas/services/pessoas.service';

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

  // === Propriedades de Estado ===
  isResizing: boolean = false;
  startX: number = 0;
  calendarCellWidth: number = 100; 
  DATE_MED = DateTime.DATE_MED;

  // === Sinais (Signals) para o Calendário ===
  videoConferencias: InputSignal<Meetings> = input.required();
  hoje: Signal<DateTime> = signal(DateTime.local());
  primeiroDiaDoMesAtivo: WritableSignal<DateTime> = signal(this.hoje().startOf('month'));
  diaAtivo: WritableSignal<DateTime | null> = signal(null);
  diasDaSemana: Signal<string[]> = signal(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);

  // === Dados ===
  @Input() videoConferencias2: { [key: string]: VideoConferencia[] } = {};
  videoConferencias$!: Observable<VideoConferencia[]>;
  
  pessoaLogada: Pessoa | null = null; 

  @Output() add = new EventEmitter(false);

  constructor(
    private readonly http: HttpClient,
    private videoConferenciasService: VideoConferenciasService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private loginService: LoginService, 
    private pessoasService: PessoasService 
  ) {}

  ngOnInit(): void {
    this.refreshCalendar();
    this.carregarUsuarioLogado(); 
  }

  // --- SEGURANÇA: VERIFICAÇÃO DE LOGIN ---
  // Método auxiliar para checar se pode editar/agendar
  private isUsuarioLogado(): boolean {
    const token = this.loginService.hasToken(); 
    if (!token) {
      this.snackBar.open('Acesso Negado: Você precisa estar logado para realizar esta ação.', 'Entendi', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }
    return true;
  }

  // --- LÓGICA DE USUÁRIO LOGADO ---
  
  private obterUsuarioDoToken(): string | null {
    const token = localStorage.getItem('auth-token'); 
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.username; 
      } catch (e) {
        console.error('Erro ao decodificar token', e);
        return null;
      }
    }
    return null;
  }

  carregarUsuarioLogado() {
    const username = this.obterUsuarioDoToken();

    if (username) {
      console.log('Buscando dados para o usuário:', username);
      
      this.pessoasService.list(username,'', 0, 1).subscribe({
        next: (page: any) => {
           if (page.pessoas && page.pessoas.length > 0) {
               this.pessoaLogada = page.pessoas[0];
               console.log('Pessoa logada encontrada:', this.pessoaLogada?.nomeGuerra);
           } else if (page.content && page.content.length > 0) {
               this.pessoaLogada = page.content[0];
           }
        },
        error: (err) => console.error('Erro ao carregar pessoa logada', err)
      });
    }
  }

  // --- LÓGICA DO CALENDÁRIO (CARREGAMENTO) ---

  refreshCalendar(): void {
    this.http.get<VideoConferencia[]>('/api/videoConferencias').subscribe(data => {
      this.videoConferencias2 = this.mapVideoConferenciasPorData(data);
    });
  }

  mapVideoConferenciasPorData(videoConferencias: VideoConferencia[]): { [key: string]: VideoConferencia[] } {
    const videoConferenciasMap: { [key: string]: VideoConferencia[] } = {};

    videoConferencias.forEach(videoConferencia => {
      if (videoConferencia.dataInicio && videoConferencia.dataFim) {
        const dataInicio = DateTime.fromISO(videoConferencia.dataInicio);
        const dataFim = DateTime.fromISO(videoConferencia.dataFim);

        for (let day = dataInicio; day <= dataFim; day = day.plus({ days: 1 })) {
          const dayISO = day.toISODate();
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

  // --- LÓGICA DO MODAL (ABRIR/SALVAR) ---

  openVideoConferenciaModal(day: DateTime, videoConferencia?: VideoConferencia): void {
    
    // 1. BLOQUEIO DE SEGURANÇA (AJUSTADO)
    // Se NÃO tem videoConferencia (é criação nova) E NÃO está logado -> Bloqueia.
    // Se TEM videoConferencia (é visualização/edição) -> Permite abrir (o Backend bloqueia o save depois).
    if (!videoConferencia && !this.isUsuarioLogado()) {
      return; 
    }

    let dataToPass;

    if (videoConferencia) {
      // MODO EDIÇÃO / VISUALIZAÇÃO
      dataToPass = {
        date: day.toISODate(),
        videoConferencia: videoConferencia
      };
    } else {
      // MODO CRIAÇÃO
      dataToPass = {
        date: day.toISODate(),
        videoConferencia: {
          pessoa: this.pessoaLogada,
          assessoria: this.pessoaLogada?.assessoria, 
          horaInicio: '',
          horaFim: ''
        }
      };
    }

    const dialogRef = this.dialog.open(VideoConferenciaModalComponent, {
      width: '600px',
      data: dataToPass
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!videoConferencia && this.pessoaLogada) {
            if (!result.pessoa) result.pessoa = this.pessoaLogada;
            if (!result.assessoria) result.assessoria = this.pessoaLogada.assessoria;
        }

        if (videoConferencia) {
          Object.assign(videoConferencia, result);
          this.videoConferenciasService.save(videoConferencia).subscribe({
            next: () => this.refreshCalendar(),
            error: (err) => this.snackBar.open('Erro ao salvar: Você precisa estar logado.', 'Fechar', { duration: 3000 })
          });
        } else {
          this.videoConferenciasService.save(result).subscribe({
            next: () => this.refreshCalendar(),
            error: (err) => this.snackBar.open('Erro ao salvar: Você precisa estar logado.', 'Fechar', { duration: 3000 })
          });
        }
      }
    });
  }


  // --- LÓGICA DE REDIMENSIONAMENTO E ARRASTAR (DRAG & DROP) ---

  startResize(event: MouseEvent, videoConferencia: VideoConferencia) {
    // 2. BLOQUEIO DE SEGURANÇA MANTIDO (Modificar o grid exige login)
    if (!this.isUsuarioLogado()) return;

    this.isResizing = true;
    this.startX = event.clientX;
  }

  onResizeEnd(event: ResizeEvent, videoConferencia: VideoConferencia): void {
    // 3. BLOQUEIO DE SEGURANÇA MANTIDO
    if (!this.isUsuarioLogado()) return;

    if (event.edges.right) {
      const resizedDays = Math.round((event.rectangle.width ?? 0) / this.calendarCellWidth);
      if (resizedDays > 0) {
        const dataInicio = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio) : DateTime.local();
        const newEndDate = dataInicio.plus({ days: resizedDays });
        videoConferencia.dataFim = newEndDate.toISODate() ?? undefined;

        this.videoConferenciasService.save(videoConferencia).subscribe(() => {
          this.snackBar.open('Redimensionado com sucesso!', 'Fechar', { duration: 3000 });
          this.refreshCalendar();
        });
      }
    }
  }

  handleDrop(event: DropEvent<VideoConferencia>, newDay: DateTime): void {
    // 4. BLOQUEIO DE SEGURANÇA MANTIDO
    if (!this.isUsuarioLogado()) return;

    const videoConferencia = event.dropData;
    if (videoConferencia && newDay) {
      const dataInicioOriginal = videoConferencia.dataInicio ? DateTime.fromISO(videoConferencia.dataInicio) : DateTime.local();
      const dataFimOriginal = videoConferencia.dataFim ? DateTime.fromISO(videoConferencia.dataFim) : dataInicioOriginal;
      const originalDuration = dataFimOriginal.diff(dataInicioOriginal, 'days').days;

      videoConferencia.dataInicio = newDay.toISODate() ?? undefined;
      videoConferencia.dataFim = newDay.plus({ days: originalDuration }).toISODate() ?? undefined;

      this.videoConferenciasService.save(videoConferencia).subscribe(() => {
        this.snackBar.open('Movido com sucesso!', 'Fechar', { duration: 3000 });
        this.refreshCalendar();
      });
    }
  }

  onDrop(event: DropEvent, newDay: DateTime): void {
     this.handleDrop(event as DropEvent<VideoConferencia>, newDay);
  }
  
  trackById(index: number, meeting: any): number {
    return meeting.id;
  }

  // --- COMPUDADOS (SIGNALS) ---

  daysOfMonth: Signal<DateTime[]> = computed(() => {
    const startOfCurrentMonth = this.primeiroDiaDoMesAtivo().startOf('month');
    const endOfCurrentMonth = this.primeiroDiaDoMesAtivo().endOf('month');
    const startOfWeek = startOfCurrentMonth.weekday;
    
    let days = [];
    if (startOfWeek !== 7) {
      const daysFromPreviousMonth = startOfCurrentMonth.minus({ days: startOfWeek });
      for (let i = 0; i < startOfWeek; i++) {
        days.push(daysFromPreviousMonth.plus({ days: i }));
      }
    }
    for (let i = 0; i < endOfCurrentMonth.day; i++) {
      days.push(startOfCurrentMonth.plus({ days: i }));
    }
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfCurrentMonth.plus({ days: i }));
    }
    return days.slice(0, 35);
  });

  activeDayMeetings: Signal<any[]> = computed(() => {
    const activeDay = this.diaAtivo();
    if (!activeDay) return [];
    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) return [];

    return this.videoConferencias2[activeDayISO]?.map(vc => ({
      horaInicio: vc.horaInicio ? DateTime.fromISO(vc.horaInicio).toFormat('HH:mm') : 'N/A',
      horaFim: vc.horaFim ? DateTime.fromISO(vc.horaFim).toFormat('HH:mm') : 'N/A',
      assessoria: vc.assessoria
    })) || [];
  });

  getVideoConferenciasForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) return [];

    const videoConferencias = Object.values(this.videoConferencias2).flat();
    const renderedVideoConferencias: any[] = [];

    return videoConferencias.filter(vc => {
      const dataInicio = vc.dataInicio ? DateTime.fromISO(vc.dataInicio).toISODate() : null;
      const dataFim = vc.dataFim ? DateTime.fromISO(vc.dataFim).toISODate() : null;

      if (dataInicio && dataFim && DateTime.fromISO(dayISO) >= DateTime.fromISO(dataInicio) && DateTime.fromISO(dayISO) <= DateTime.fromISO(dataFim)) {
        if (!renderedVideoConferencias.find(a => a.id === vc.id)) {
          renderedVideoConferencias.push(vc);
          return true;
        }
      }
      return false;
    });
  }

  // --- NAVEGAÇÃO DO CALENDÁRIO ---

  goToPreviousMonth(): void {
    this.primeiroDiaDoMesAtivo.set(this.primeiroDiaDoMesAtivo().minus({ month: 1 }));
  }

  goToNextMonth(): void {
    this.primeiroDiaDoMesAtivo.set(this.primeiroDiaDoMesAtivo().plus({ month: 1 }));
  }

  goToToday(): void {
    this.primeiroDiaDoMesAtivo.set(this.hoje().startOf('month'));
  }

  previousMonth() { this.goToPreviousMonth(); }
  nextMonth() { this.goToNextMonth(); }

}