import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { Assessoria } from '../../../assessorias/model/assessoria';
import { AssessoriasService } from '../../../assessorias/services/assessorias.service';
import { PostoGraduacao, PostoGraduacaoList } from '../../../enums/PostoGraduacao/PostoGraduacao';
import { TipoAcesso, TipoAcessoList } from '../../../enums/TipoAcesso';
import { MediaService } from '../../../media.service';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { PessoasService } from '../../services/pessoas.service';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IMaskDirective } from 'angular-imask';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pessoas-externas-form', // Seletor atualizado
  templateUrl: './pessoas-externas-form.component.html',
  styleUrl: './pessoas-externas-form.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    IMaskDirective,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class PessoasExternasFormComponent implements OnInit {

  form: UntypedFormGroup;
  assessorias: Assessoria[] = [];
  assessoriasPai: Assessoria[] = [];

  // Listas
  postos = PostoGraduacaoList;
  tipoAcessos = TipoAcessoList;

  url?: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: PessoasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private assessoriasService: AssessoriasService,
    private mediaService: MediaService
  ) {
    // === CRIAÇÃO DO FORMULÁRIO SIMPLIFICADO ===
    this.form = this.formBuilder.group({
      _id: [''],
      // Identidade não é obrigatória aqui, enviamos vazio
      identidade: [''],

      // Nome Completo é o principal
      nome: ['', Validators.required],

      // Nome de Guerra (opcional, pode deixar vazio ou copiar do nome depois)
      nomeGuerra: [''],

      postoGraduacao: ['', Validators.required],

      // Campos que não usamos no externo, iniciados vazios para não quebrar o modelo
      armaquadroservico: [''],
      dataUltimaPromocao: [''],
      dt_praca: [''],
      dt_nascimento: [''],
      users: [''],

      tipoAcesso: ['', Validators.required],
      assessoria: [null, Validators.required],

      liberado: [true, Validators.required], // Padrão liberado

      // Ramal continua obrigatório e com máscara
      ramal: ['', [Validators.required, Validators.pattern('^810 - \\d{4}$')]],

      caminho: [''] // Foto não é obrigatória (Validators.required removido)
    });

    // Carregar Assessorias (ou OMs, se tiver uma lista específica)
    this.assessoriasService.listPai().subscribe((data: any[]) => {
      this.assessoriasPai = data;
    });
  }

  ngOnInit(): void {
    // Verifica se veio dados da rota (Edição)
    const pessoa: any = this.route.snapshot.data['pessoa'];

    if (pessoa && pessoa._id) {
      this.form.patchValue({
        _id: pessoa._id,
        identidade: pessoa.identidade,
        nome: pessoa.nome,
        nomeGuerra: pessoa.nomeGuerra,
        postoGraduacao: pessoa.postoGraduacao,
        tipoAcesso: pessoa.tipoAcesso,
        assessoria: pessoa.assessoria,
        liberado: pessoa.liberado,
        ramal: pessoa.ramal,
        caminho: pessoa.caminho
      });
      this.url = pessoa.caminho;
    }
  }

  // === UPLOAD ADAPTADO ===
  upload(event: any) {
    const file: File = event.target.files[0];

    const nomePessoa = this.form.get('nome')?.value;
    const identidade = this.form.get('identidade')?.value;

    if (file) {
      let nomeArquivo = '';

      if (identidade) {
        nomeArquivo = `${identidade}.jpg`;
      }
      else {
        // Lógica de Sanitização Segura
        const baseNome = nomePessoa || 'externo';

        const nomeLimpo = baseNome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/[^a-z0-9]/g, "");     // Remove 'ª', 'º', espaços e símbolos

        const timestamp = new Date().getTime();
        nomeArquivo = `${nomeLimpo}_${timestamp}.jpg`;
      }

      const renamedFile = new File([file], nomeArquivo, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', renamedFile);

      this.mediaService.uploadFile(formData)
        .subscribe((response: any) => {
          console.log('Upload ok:', response.url);
          this.url = response.url;
          this.form.patchValue({ caminho: response.url });
        });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      // 1. Clona os dados do formulário para não mexer na tela
      const dadosParaEnviar = { ...this.form.value };

      // 2. O TRUQUE: Transforma vazio ('') em NULL
      // Se não fizer isso, o Java acha que '' é uma identidade inválida
      if (!dadosParaEnviar.identidade) dadosParaEnviar.identidade = null;

      // Faça o mesmo para outros campos opcionais para garantir
      if (!dadosParaEnviar.nomeGuerra) dadosParaEnviar.nomeGuerra = null;
      if (!dadosParaEnviar.armaquadroservico) dadosParaEnviar.armaquadroservico = null;
      if (!dadosParaEnviar.ramal) dadosParaEnviar.ramal = null;
      if (!dadosParaEnviar.dataUltimaPromocao) dadosParaEnviar.dataUltimaPromocao = null;
      if (!dadosParaEnviar.dt_praca) dadosParaEnviar.dt_praca = null;
      if (!dadosParaEnviar.dt_nascimento) dadosParaEnviar.dt_nascimento = null;

      // Foto também
      if (!dadosParaEnviar.caminho) dadosParaEnviar.caminho = null;

      // 3. Envia (Create ou Update)
      // Se tiver ID, é atualização. Se não, é novo.
      if (this.form.value._id) {
        // Lógica de Update (PUT)
        this.service.save(dadosParaEnviar).subscribe(
          result => this.onSuccess(),
          error => this.onError()
        );
      } else {
        // Lógica de Create (POST)
        this.service.save(dadosParaEnviar).subscribe(
          result => this.onSuccess(),
          error => this.onError()
        );
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.snackBar.open('Militar externo salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.dialog.open(ErrorDialogComponent, {
      data: 'Erro ao salvar militar externo.'
    });
  }

  errorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field?.hasError('pattern')) {
      return 'Formato inválido (Ex: 810 - 0000)';
    }
    return 'Campo inválido';
  }
}