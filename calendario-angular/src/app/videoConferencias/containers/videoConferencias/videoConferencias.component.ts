import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { VideoConferencia } from '../../modelo/VideoConferencia';

import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { ResizeEvent } from 'angular-resizable-element';
import { Assessoria } from '../../../assessorias/model/assessoria';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { ConfimationDialogComponent } from '../../../shared/components/error-dialog/confimation-dialog/confimation-dialog.component';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { VideoConferenciaPage } from '../../modelo/videoConferencia-page';
import { VideoConferenciasService } from '../../services/videoConferencias.service';
import { VideoConferenciasListaComponent } from "../../components/videoConferencias-lista/video-conferencias-lista.component";
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-videoConferencias',
    templateUrl: './videoConferencias.component.html',
    styleUrls: ['./videoConferencias.component.scss'],
    standalone: true,
    imports: [MatCard, MatToolbar, MatPaginator, MatProgressSpinner, MatDatepickerModule, AsyncPipe, MatFormFieldModule, MatInputModule, MatSelectModule, VideoConferenciasListaComponent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class VideoConferenciasComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;
  length = 0;

  dataInicio: string | null | undefined = undefined;
  dataFim: string | null | undefined = undefined;


  termo = '';

  onResizeEnd(event: ResizeEvent): void {
    console.log('Resize event:', event);
  }

  videoConferencias$!: Observable<VideoConferencia[]>;
  videoConferencias2$!: Observable<VideoConferenciaPage>;

  videoConferencias: VideoConferencia[] = [];

  videoConferencia: VideoConferencia[] = [];

  videoConferenciasOriginais: VideoConferencia[] = [];

  assessorias: Assessoria[] = [];

  assessoriasOriginais: Assessoria[] = [];

  constructor(
    private readonly assessoriasService: AssessoriasService,
    private readonly fb: FormBuilder,
    private  videoConferenciasService: VideoConferenciasService,
    // private videoConferenciaModalService: VideoConferenciaModalService,
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
  this.videoConferencias$ = this.videoConferenciasService.list()
  .pipe(
    catchError(error => {
      this.onError('Erro ao carregar videoConferencias');
      return of([])
    })
  );
}

refresh2(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  this.videoConferencias2$ = this.videoConferenciasService.list2(termo, pageEvent.pageIndex, pageEvent.pageSize).pipe(
    tap((page: VideoConferenciaPage) => {
      // Atualize o estado local com os dados retornados
      this.videoConferencias = page.content; // ou page.videoConferencias dependendo do formato
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;

      //console.log('VideoConferencias carregados:', this.videoConferencias);
    }),
    catchError(error => {
      this.onError('Erro ao carregar videoConferencias');
      return of({ content: [], videoConferencias:[], totalElements: 0, totalPages: 0 });
    })
  );
}


refresh3(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }, termo = '') {
  const dataInicio = this.dataInicio ?? null;
  const dataFim = this.dataFim ?? null;
  this.videoConferencias2$ = this.videoConferenciasService.list3(dataInicio, dataFim, pageEvent.pageIndex, pageEvent.pageSize).pipe(
    tap((page: VideoConferenciaPage) => {
      // Atualize o estado local com os dados retornados
      this.videoConferencias = page.content; // ou page.videoConferencias dependendo do formato
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;

      //console.log('VideoConferencias carregados:', this.videoConferencias);
    }),
    catchError(error => {
      this.onError('Erro ao carregar videoConferencias');
      return of({ content: [], videoConferencias:[], totalElements: 0, totalPages: 0 });
    })
  );
}


     // Escutar mudanças no campo 'pessoa'
onVideoConferenciaChange(videoConferenciaId: string): void {
  // Encontre a pessoa selecionada a partir da lista de pessoas
  const selectedVideoConferencia = this.videoConferencias.find(videoConferencia => videoConferencia.id === Number(videoConferenciaId));

  // Se a pessoa tiver uma assessoria associada, atualize o campo 'assessoria'
  if (selectedVideoConferencia && selectedVideoConferencia.assessoria) {
    // Add meaningful code here or remove the block if not needed
    //console.log(`Selected pessoa has assessoria: ${selectedVideoConferencia.assessoria}`);
  }
}

onSearchByDate(type: 'inicio' | 'fim', value: Date | null): void {
  if (type === 'inicio') {
    this.dataInicio = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
  } else if (type === 'fim') {
    this.dataFim = value ? value.toISOString().split('T')[0] : null; // Converte para 'yyyy-MM-dd'
  }

  //console.log('Datas atualizadas:', { dataInicio: this.dataInicio, dataFim: this.dataFim });

  // Se ambos os campos de data estão vazios, reseta para o estado inicial
  if (!this.dataInicio && !this.dataFim) {
    this.loadAllVideoConferencias(); // Carrega todos os videoConferencias
  } else {
    this.refresh3({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }
}

// Método para carregar todos os videoConferencias (estado inicial)
loadAllVideoConferencias(): void {
  this.videoConferenciasService.getAllVideoConferencias(this.pageSize, this.pageIndex).subscribe((response) => {
    this.videoConferencias = response.content;
    this.length = response.totalElements;
  });
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
    // Aplica o filtro para pesquisar videoConferencias pela assessoria selecionada.
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
  //     this.videoConferencias = [...this.videoConferenciasOriginais];
  //   } else {
  //     // Filtra os itens com base no termo digitado
  //     this.videoConferencias = this.videoConferenciasOriginais.filter(videoConferencia =>
  //       videoConferencia.assessoria.sigla.toLowerCase().includes(value.toLowerCase())
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

  onEdit(videoConferencia: VideoConferencia): void {
    if (videoConferencia.id) {
      this.router.navigate(['edit', videoConferencia.id], { relativeTo: this.route });
    } else {
      console.error('ID do videoConferencia está indefinido:', videoConferencia);
    }
  }


    onRemove(videoConferencia: VideoConferencia) {

    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      data: 'Tem certeza quanto a remoção desse videoConferencia?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result){
        this.videoConferenciasService.remove(videoConferencia.id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('VideoConferencia removido com sucesso!', 'X', {
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

