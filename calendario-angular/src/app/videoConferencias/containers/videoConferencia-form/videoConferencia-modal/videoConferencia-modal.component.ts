// import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
// import { Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
// import { Pessoa } from '../../../../pessoas/model/pessoa';
// import { Assessoria } from '../../../../assessorias/model/assessoria';
// import { AssessoriasService } from '../../../../assessorias/services/assessorias.service';
// import { PessoasService } from '../../../../pessoas/services/pessoas.service';
// import { AcessoriosList } from '../../../../enums/Acessorios/Acessorios';

// import { ActivatedRoute } from '@angular/router';
// import { VideoConferenciasService } from '../../../services/videoConferencias.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
// import { Location } from '@angular/common';
// import { DateTime } from 'luxon';
// import { VideoConferencia } from '../../../modelo/VideoConferencia';
// import { PessoaPage } from '../../../../pessoas/model/pessoa-page';
// import { MatButton } from '@angular/material/button';
// import { MatOption } from '@angular/material/core';
// import { MatSelect } from '@angular/material/select';
// import { MatInput } from '@angular/material/input';
// import { MatFormField, MatLabel } from '@angular/material/form-field';

// import { CommonModule } from '@angular/common'; // <--- Importe isso


// @Component({
//     selector: 'app-videoConferencia-modal',
//     templateUrl: './videoConferencia-modal.component.html',
//     styleUrl: './videoConferencia-modal.component.scss',
//     standalone: true,
//     imports: [CommonModule,MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatDialogActions, MatButton]
// })
// export class VideoConferenciaModalComponent implements OnInit {

//   isHidden: boolean = true;

//   form: UntypedFormGroup;

//   isSubmitting = false; // Adicione uma variável para controlar o estado de submissão

//   @Output() add = new EventEmitter(false);
//   @Output() edit = new EventEmitter(false);

//   pessoas: Pessoa [] = [];
//   assessorias: Assessoria [] = [];

//   pessoasOriginais: Pessoa[] = []; // Array com todos os registros originais

//   acessorios = AcessoriosList; // Lista de acessórios
//   allSelected: boolean = false; // Flag para verificar se todos estão selecionados
//   dateHoje: any;
//   dateSelecionada: string | undefined;


//   constructor(
//     private formBuilder: UntypedFormBuilder,
//     @Inject(VideoConferenciasService) private videoConferenciasService: VideoConferenciasService,
//     private assessoriasService: AssessoriasService,
//     private pessoasService: PessoasService,
//     private snackBar: MatSnackBar,
//     private dialog: MatDialog,
//     private location: Location,
//     private route: ActivatedRoute,
//     public dialogRef: MatDialogRef<VideoConferenciaModalComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { videoConferencia: VideoConferencia, date: Date }
//   ) {
//     // Inicializa `this.dateHoje` com a data atual
//   this.dateSelecionada = this.data.date.toLocaleString(); // Usando Luxon para obter a data atual em formato ISO
//     if(this.data.videoConferencia){
//       this.form = this.formBuilder.group({
//         _id: [''],
//         dataInicio: [''], // Certifique-se de que está capturando uma data válida
//         dataFim: [''],
//         horaInicio: ['', Validators.required], // Deve capturar uma string de hora
//         horaFim: ['', Validators.required], // Deve capturar uma string de hora
//         pessoa: [null], // Captura o ID da pessoa
//         assessoria: [null], // Captura o ID da assessoria
//         acessorios: [[]], // Captura uma lista de acessórios
//         audiencia: [null, Validators.required],
//         evento: [null, Validators.required],
//         diex: [null, Validators.required],
//         militarLigacao: [null, Validators.required]
//       });
//     } else {
//       this.form = this.formBuilder.group({
//         dataInicio: [''], // Certifique-se de que está capturando uma data válida
//         dataFim: [''], // Certifique-se de que está capturando uma data válida
//         horaInicio: ['', Validators.required], // Deve capturar uma string de hora
//         horaFim: ['', Validators.required], // Deve capturar uma string de hora
//         pessoa: [null], // Captura o ID da pessoa
//         assessoria: [null], // Captura o ID da assessoria
//         acessorios: [[]], // Captura uma lista de acessórios
//         audiencia: [null, Validators.required],
//         evento: [null, Validators.required],
//         diex: [null, Validators.required],
//         militarLigacao: [null, Validators.required]
//       });
//     }

//     this.assessoriasService.list().subscribe((data: any[]) => {
//       this.assessorias = data;
//       console.log(data)
//      });

//      this.pessoasService.list().subscribe((data: PessoaPage) => {
//       this.pessoas = data.pessoas;
//      });

//      this.pessoasService.listPessCompl().subscribe((data: any[]) => {
//       this.pessoas = data;
//      });
//   }

//   comparePessoa(p1: Pessoa, p2: Pessoa): boolean {
//     return p1 && p2 ? p1._id === p2._id : p1 === p2;
//   }


//   ngOnInit(): void {
//     // Verifique se o videoConferencia foi passado
//   const videoConferencia: VideoConferencia | undefined = this.data.videoConferencia;
//   this.dateSelecionada = this.data.date.toLocaleString(); // Usando Luxon para obter a data atual em formato ISO
//     // const id = this.data.videoConferencia._id
//     if (videoConferencia) {
//       // Se for edição, preencha o formulário com os dados do videoConferencia
//       this.form.patchValue({
//         _id: videoConferencia.id || null,
//         dataInicio: videoConferencia.dataInicio ||  '',
//         dataFim: videoConferencia.dataFim || '',
//         horaInicio: videoConferencia.horaInicio || '',
//         horaFim: videoConferencia.horaFim || '',
//         pessoa: videoConferencia.pessoa ? videoConferencia.pessoa._id : '', // Preencha com o ID da pessoa
//         assessoria: videoConferencia.assessoria ? videoConferencia.assessoria._id : '', // Preencha com o ID da assessoria
//         acessorios: videoConferencia.acessorios || [],
//         audiencia: videoConferencia.audiencia || '',
//         evento: videoConferencia.evento || '',
//         diex: videoConferencia.diex || '',
//         militarLigacao: videoConferencia.militarLigacao || '',
        
//       });
//       console.log("Pegando videoConferencia antes de salvar: ", videoConferencia)
//     } else {
//       // console.log("Data selecionada:", this.dateSelecionada)
//       // Valores padrão se não houver videoConferencia existente
//       this.form.setValue({
//         // _id: null,
//         dataInicio: this.dateSelecionada,
//         dataFim: this.dateSelecionada,
//         horaInicio: '',
//         horaFim: '',
//         pessoa: '',
//         assessoria: '',
//         acessorios: '',
//         audiencia: '',
//         evento: '',
//         diex: '',
//         militarLigacao: ''
//       });

//        // Log para verificar se o ID está sendo passado
//   console.log('VideoConferencia recebido no modal:', videoConferencia);
//     }

//     // Escuta mudanças no campo "pessoa"
//     this.form.get('pessoa')?.valueChanges.subscribe((selectedPessoa: Pessoa) => {
//       if (selectedPessoa && selectedPessoa.assessoria && selectedPessoa.assessoria._id) {
//         // Atualiza o campo "assessoria" com a assessoria da pessoa selecionada
//         this.form.patchValue({ assessoria: selectedPessoa.assessoria._id });
//       }
//     });

//     this.pessoasService.listPessCompl().subscribe((data: Pessoa[]) => {
//       this.pessoas = data;
//       this.pessoasOriginais = [...data]; // Clona os dados originais
//     });
//   }

//   // Escutar mudanças no campo 'pessoa'
// onPessoaChange(pessoaId: string): void {
//   // Encontre a pessoa selecionada a partir da lista de pessoas
//   const selectedPessoa = this.pessoas.find(pessoa => pessoa._id === pessoaId);

//   // Se a pessoa tiver uma assessoria associada, atualize o campo 'assessoria'
//   if (selectedPessoa && selectedPessoa.assessoria) {
//     this.form.patchValue({ assessoria: selectedPessoa.assessoria._id });
//   } else {
//     // Se a pessoa não tiver assessoria, deixe o campo vazio ou com algum valor padrão
//     this.form.patchValue({ assessoria: null });
//   }
// }



// // Função para garantir que a data seja formatada corretamente
// formatDate(date: any): string {
//   if (date instanceof DateTime) {
//       // Se for DateTime de Luxon, usar toISODate e tratar caso retorne null
//       return date.toISODate() ?? ''; // Usa uma string vazia se for null
//   } else if (date instanceof Date) {
//       // Se for Date nativo do JavaScript, formata manualmente
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//   }
//   return ''; // Valor padrão se a data estiver indefinida ou em formato desconhecido
// }




//   // Verifica se um acessório específico está selecionado
//   isAcessorioSelected(acessorio: any): boolean {
//     const selectedAcessorios = this.form.controls['acessorios'].value;
//     return selectedAcessorios.includes(acessorio);
//   }

//   // Função chamada quando a seleção de acessórios muda
//   onAcessoriosChange(event: any) {
//     const selectedAcessorios = event.value;
//     this.allSelected = selectedAcessorios.length === this.acessorios.length;
//   }



//   // onSubmit() {
//   //   this.videoConferenciasService.save(this.form.value)
//   //   .subscribe(result => this.onSuccess(), error => this.onError());

//   // }



//   onSubmit(): void {
//     if (this.form.valid && !this.isSubmitting) {
//       this.isSubmitting = true;

//       // Depurando o valor de dataInicio
//       console.log('Valor de dataInicio antes de enviar:', this.form.value.dataInicio);

//       const videoConferencia = {
//         ...this.form.value,
//         id: this.form.value._id, // Certifique-se de que o ID está sendo enviado corretamente
//         dataInicio: this.dateSelecionada, // Formata a data corretamente
//         pessoa: { _id: this.form.value.pessoa }, // Certifique-se de que está enviando o _id da pessoa
//         assessoria: { _id: this.form.value.assessoria }, // Certifique-se de que está enviando o _id da assessoria
//         acessorios: this.form.value.acessorios // Acessórios continuam como estão
//       };
//       console.log(videoConferencia)

//       this.videoConferenciasService.save(videoConferencia).subscribe(

//         result => {
//           this.snackBar.open('VideoConferencia salvo com sucesso!', '', { duration: 5000 });
//           this.dialogRef.close(result); // Fecha o modal
//           this.edit.emit(); // Emite um evento para o componente pai
//           this.isSubmitting = false;
//           console.log('Dados do formulário antes de salvar:', videoConferencia);
//           console.log('dataInicio:', this.form.value.dataInicio);
//         },
//         error => {
//           this.snackBar.open('Erro ao salvar videoConferencia!', '', { duration: 5000 });
//           this.isSubmitting = false;
//         }
//       );
//     }
//   }


// // Função para formatar a data usando Luxon
// // formatDate(date: any): string {
// //   return DateTime.fromISO(date).toFormat('yyyy-MM-dd'); // Usa Luxon para formatar
// // }


//   onAdd(){
//     this.add.emit(true);
//   }

//   onEdit(videoConferencia: VideoConferencia ){
//     this.edit.emit(videoConferencia);
//   }

//   onCancel() {
//     this.location.back();
//   }

//   private onSuccess() {
//     this.snackBar.open('VideoConferencia salva com successo!', '', { duration: 5000 });
//     this.onCancel();
//   }

//   private onError() {
//     this.dialog.open(ErrorDialogComponent, {
//       data: 'Erro ao tentar realisar videoConferencia .'
//     });
//   }

//   errorMessage(fieldName: string): string {
//     const field = this.form.get(fieldName);
//     if (field?.hasError('required')){
//       return 'Campo obrigatório';

//     }
//     if (field?.hasError('minlength')){
//       const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
//       return `Tamanho minimo precisa ser de ${requiredLength} caractéres.`;

//     }

//     if (field?.hasError('pattern')){
//       const requiredPattern = field.errors ? field.errors['pattern']['requiredPattern'] : '000.000.000-0';
//       return `O campo só pode conter ${requiredPattern} como valores.`;

//     }

//     return 'Campo inválido';
//     // return this.formUtils.getFieldErrorMessage(this.form, fieldName);
//   }

// }


import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';

import { Assessoria } from '../../../../assessorias/model/assessoria';
import { AssessoriasService } from '../../../../assessorias/services/assessorias.service';
import { AcessoriosList } from '../../../../enums/Acessorios/Acessorios';
import { Pessoa } from '../../../../pessoas/model/pessoa';
import { PessoaPage } from '../../../../pessoas/model/pessoa-page';
import { PessoasService } from '../../../../pessoas/services/pessoas.service';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { VideoConferencia } from '../../../modelo/VideoConferencia';
import { VideoConferenciasService } from '../../../services/videoConferencias.service';

@Component({
  selector: 'app-videoConferencia-modal',
  templateUrl: './videoConferencia-modal.component.html',
  styleUrl: './videoConferencia-modal.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton
  ]
})
export class VideoConferenciaModalComponent implements OnInit {

  isHidden: boolean = true;
  form: UntypedFormGroup;
  isSubmitting = false;

  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);

  pessoas: Pessoa[] = [];
  assessorias: Assessoria[] = [];
  pessoasOriginais: Pessoa[] = [];

  acessorios = AcessoriosList;
  allSelected: boolean = false;
  dateHoje: any;
  dateSelecionada: string | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(VideoConferenciasService) private videoConferenciasService: VideoConferenciasService,
    private assessoriasService: AssessoriasService,
    private pessoasService: PessoasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<VideoConferenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { videoConferencia: VideoConferencia, date: any }
  ) {
    // 1. Lógica para formatar a data (YYYY-MM-DD)
    if (this.data.date) {
        if (this.data.date instanceof Date) {
            this.dateSelecionada = this.data.date.toISOString().split('T')[0];
        } else {
            // Se for string (ex: ISO), pega só a data
            this.dateSelecionada = this.data.date.toString().split('T')[0];
        }
    } else {
        this.dateSelecionada = new Date().toISOString().split('T')[0];
    }

    // 2. Criação do Formulário
    // Nota: Mesmo se data.videoConferencia existir, precisamos garantir que as datas sejam preenchidas
    // se estiverem vazias no objeto. A lógica de inicialização principal está no ngOnInit.
    if (this.data.videoConferencia) {
      this.form = this.formBuilder.group({
        _id: [''],
        dataInicio: [''],
        dataFim: [''],
        horaInicio: ['', Validators.required],
        horaFim: ['', Validators.required],
        pessoa: [null],
        assessoria: [null],
        acessorios: [[]],
        audiencia: [null, Validators.required],
        evento: [null, Validators.required],
        diex: [null, Validators.required],
        militarLigacao: [null, Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        dataInicio: [this.dateSelecionada, Validators.required],
        dataFim: [this.dateSelecionada, Validators.required],
        horaInicio: ['', Validators.required],
        horaFim: ['', Validators.required],
        pessoa: [null],
        assessoria: [null],
        acessorios: [[]],
        audiencia: [null, Validators.required],
        evento: [null, Validators.required],
        diex: [null, Validators.required],
        militarLigacao: [null, Validators.required]
      });
    }

    this.assessoriasService.list().subscribe((data: any[]) => {
      this.assessorias = data;
      console.log(data);
    });

    this.pessoasService.list().subscribe((data: PessoaPage) => {
      this.pessoas = data.pessoas;
    });

    this.pessoasService.listPessCompl().subscribe((data: any[]) => {
      this.pessoas = data;
    });
  }

  comparePessoa(p1: Pessoa, p2: Pessoa): boolean {
    return p1 && p2 ? p1._id === p2._id : p1 === p2;
  }

  ngOnInit(): void {
    const videoConferencia: VideoConferencia | undefined = this.data.videoConferencia;
    
    // Fallback: Se dateSelecionada estiver vazia, tenta preencher novamente
    if (!this.dateSelecionada && this.data.date) {
        this.dateSelecionada = this.data.date.toString().split('T')[0];
    }

    if (videoConferencia) {
      this.form.patchValue({
        _id: videoConferencia.id || null,
        // CORREÇÃO CRÍTICA AQUI:
        // Se o objeto videoConferencia não tiver data (ex: criação com pré-preenchimento), 
        // usamos a dateSelecionada que veio do calendário.
        dataInicio: videoConferencia.dataInicio || this.dateSelecionada, 
        dataFim: videoConferencia.dataFim || this.dateSelecionada,
        
        horaInicio: videoConferencia.horaInicio || '',
        horaFim: videoConferencia.horaFim || '',
        pessoa: videoConferencia.pessoa ? videoConferencia.pessoa._id : '',
        assessoria: videoConferencia.assessoria ? videoConferencia.assessoria._id : '',
        acessorios: videoConferencia.acessorios || [],
        audiencia: videoConferencia.audiencia || '',
        evento: videoConferencia.evento || '',
        diex: videoConferencia.diex || '',
        militarLigacao: videoConferencia.militarLigacao || '',
      });
      console.log("Formulário preenchido (Edição/Novo com Preload): ", this.form.value);
    } else {
      this.form.patchValue({
        dataInicio: this.dateSelecionada,
        dataFim: this.dateSelecionada,
      });
      console.log('Formulário preenchido (Novo simples):', this.form.value);
    }

    // Escuta mudanças no campo "pessoa"
    this.form.get('pessoa')?.valueChanges.subscribe((selectedPessoaId: any) => {
        const selectedPessoa = this.pessoas.find(p => p._id === selectedPessoaId);
        if (selectedPessoa && selectedPessoa.assessoria && selectedPessoa.assessoria._id) {
            this.form.patchValue({ assessoria: selectedPessoa.assessoria._id });
        }
    });

    this.pessoasService.listPessCompl().subscribe((data: Pessoa[]) => {
      this.pessoas = data;
      this.pessoasOriginais = [...data];
    });
  }

  onPessoaChange(pessoaId: string): void {
    const selectedPessoa = this.pessoas.find(pessoa => pessoa._id === pessoaId);

    if (selectedPessoa && selectedPessoa.assessoria) {
      this.form.patchValue({ assessoria: selectedPessoa.assessoria._id });
    } else {
      this.form.patchValue({ assessoria: null });
    }
  }

  formatDate(date: any): string {
    if (date instanceof DateTime) {
      return date.toISODate() ?? '';
    } else if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  isAcessorioSelected(acessorio: any): boolean {
    const selectedAcessorios = this.form.controls['acessorios'].value;
    return selectedAcessorios ? selectedAcessorios.includes(acessorio) : false;
  }

  onAcessoriosChange(event: any) {
    const selectedAcessorios = event.value;
    this.allSelected = selectedAcessorios.length === this.acessorios.length;
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      console.log('Valor de dataInicio antes de enviar:', this.form.value.dataInicio);

      const videoConferencia = {
        ...this.form.value,
        id: this.form.value._id,
        dataInicio: this.form.value.dataInicio, 
        dataFim: this.form.value.dataFim,
        
        pessoa: { _id: this.form.value.pessoa },
        assessoria: { _id: this.form.value.assessoria },
        acessorios: this.form.value.acessorios
      };
      console.log(videoConferencia);

      this.videoConferenciasService.save(videoConferencia).subscribe(
        result => {
          this.snackBar.open('VideoConferencia salvo com sucesso!', '', { duration: 5000 });
          this.dialogRef.close(result);
          this.edit.emit();
          this.isSubmitting = false;
          console.log('Dados do formulário antes de salvar:', videoConferencia);
        },
        error => {
          this.snackBar.open('Erro ao salvar videoConferencia!', '', { duration: 5000 });
          this.isSubmitting = false;
        }
      );
    }
  }

  onAdd() {
    this.add.emit(true);
  }

  onEdit(videoConferencia: VideoConferencia) {
    this.edit.emit(videoConferencia);
  }

  onCancel() {
    this.dialogRef.close();
  }

  private onSuccess() {
    this.snackBar.open('VideoConferencia salva com successo!', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.dialog.open(ErrorDialogComponent, {
      data: 'Erro ao tentar realisar videoConferencia .'
    });
  }

  errorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Tamanho minimo precisa ser de ${requiredLength} caractéres.`;
    }
    if (field?.hasError('pattern')) {
      const requiredPattern = field.errors ? field.errors['pattern']['requiredPattern'] : '000.000.000-0';
      return `O campo só pode conter ${requiredPattern} como valores.`;
    }
    return 'Campo inválido';
  }
}