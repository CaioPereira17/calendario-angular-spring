import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Pessoa } from '../model/pessoa';
import { PessoasService } from '../services/pessoas.service';


@Injectable({
  providedIn: 'root'
})
export class PessoaResolver  {

  constructor(private readonly service: PessoasService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pessoa> | Promise<Pessoa> | Pessoa {
    if (route.params && route.params['id']) {
      return this.service.loadById(route.params['id']);
    }
    return of({_id:'' , identidade:'', users:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false} , liberado:'', ramal:'', caminho:'', dataUltimaPromocao:'25/11/2025'});
  }



}
