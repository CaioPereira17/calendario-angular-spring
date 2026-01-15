import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios.service';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { IMaskDirective } from 'angular-imask';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  standalone: true,
    imports: [ MatFormFieldModule, MatInputModule, MatDialogModule, ReactiveFormsModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput,MatButton]
})
export class ChangePasswordComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data
  ) {
    this.form = this.formBuilder.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      disableClose: true,
    });
  }

  onChangePassword(): void {
    const { senhaAtual, novaSenha } = this.form.value;
    this.usuariosService.changePassword(senhaAtual, novaSenha).subscribe({
      next: () => {
        alert('Senha alterada com sucesso');
        this.dialogRef.close();
      },
      error: (err) => {
        alert('Erro ao alterar senha: ' + err.error.message);
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
