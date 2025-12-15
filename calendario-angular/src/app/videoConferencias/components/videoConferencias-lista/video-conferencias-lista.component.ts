import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VideoConferencia } from '../../modelo/VideoConferencia';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { VideoConferenciaModalComponent } from '../../containers/videoConferencia-form/videoConferencia-modal/videoConferencia-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VideoConferenciasService } from '../../services/videoConferencias.service';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';


@Component({
    selector: 'app-video-conferencias-lista',
    templateUrl: './video-conferencias-lista.component.html',
    styleUrl: './video-conferencias-lista.component.scss',
    standalone: true,
    imports: [MatCard, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatMiniFabButton, MatIcon, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class VideoConferenciasListaComponent implements OnInit {

  videoConferencias$!: Observable<VideoConferencia[]>;

  diaAtivo: DateTime | null = null; // Defina a propriedade diaAtivo aqui
  @Input() videoConferencias2: { [key: string]: VideoConferencia[] } = {}; // Inicializa com um objeto vazio
  @Input() videoConferencias: VideoConferencia[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter<VideoConferencia>(); // Mudança aqui para passar o videoConferencia
  @Output() delete = new EventEmitter(false);

  readonly displayedColumns = ['dataInicio', 'dataFim' ,'horaInicio', 'horaFim', 'pessoa', 'assessoria', 'acoes'];


  dataSource = new MatTableDataSource<VideoConferencia>();
  dateHoje: string | undefined;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private  readonly videoConferenciasService: VideoConferenciasService
  ) { }


  ngOnInit(): void {

    this.dataSource.data = this.videoConferencias;

    // this.http.get<VideoConferencia[]>('/api/videoConferencias').subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log(data)
    // });


  }

  onAdd(){
    this.add.emit(true);
  }


   //Novo método para escutar o evento de edição
  onEdit(videoConferencia: VideoConferencia): void {
    console.log(videoConferencia.id)
    if (videoConferencia.dataInicio) {
        const day = DateTime.fromISO(videoConferencia.dataInicio); // Mantém como DateTime
        // const day = DateTime.local(); // Usa a data atual como DateTime
        this.openVideoConferenciaModal(day, videoConferencia); // Chama o modal com o DateTime e o videoConferencia

    } else {
        console.error('A data do videoConferencia está indefinida.');
        // Define um comportamento padrão, como atribuir a data atual
        const day = DateTime.local(); // Usa a data atual como DateTime
        this.openVideoConferenciaModal(day, videoConferencia);
    }
}

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
          this.refresh();
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
          this.refresh();
          this.refreshCalendar();
        });
      }
    });
  }
}

  refreshCalendar(): void {
    this.videoConferenciasService.list().subscribe(videoConferencias => {
      this.videoConferencias = videoConferencias; // Atualiza o array de videoConferencias
      // Outras lógicas de atualização de calendário, se necessário
    });
  }


  refresh() {
    this.videoConferencias$ = this.videoConferenciasService.list()
      .pipe(
        catchError(error => {
          this.onError();
          return of([]); // Retorna uma lista vazia em caso de erro
        })
      );

    // Se você quiser atualizar a lista no DataSource do MatTable também:
    this.videoConferenciasService.list().subscribe((videoConferencias: VideoConferencia[]) => {
      this.dataSource.data = videoConferencias;
    });
  }



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

  getVideoConferenciasForDay(day: DateTime): any[] {
    const dayISO = day.toISODate();
    if (!dayISO) {
      return []; // Retorna uma lista vazia se dayISO for null
    }

    // Verificar e depurar se os videoConferencias estão sendo encontrados
    const videoConferencias = this.videoConferencias2[dayISO] || [];
    // console.log(`VideoConferencias para ${dayISO}:`, videoConferencias);
    return videoConferencias.map(videoConferencia => {
      const horaInicio = videoConferencia.horaInicio ? DateTime.fromISO(videoConferencia.horaInicio).toFormat('HH:mm') : 'N/A';
      const horaFim = videoConferencia.horaFim ? DateTime.fromISO(videoConferencia.horaFim).toFormat('HH:mm') : 'N/A';
      this.refresh();
      return {
        horaInicio: horaInicio,
        horaFim: horaFim,
        assessoria: videoConferencia.assessoria
      };
    });
  }

  private onError() {
    this.dialog.open(ErrorDialogComponent, {
      data: 'Erro ao tentar realisar videoConferencia .'
    });
  }

  onDelete(videoConferencia: VideoConferencia) {
    this.delete.emit(videoConferencia);
  }

}
