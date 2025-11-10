import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';


import { Observable, of } from 'rxjs';
import { CalendariosService } from '../services/calendarios.service';
import { Agendamento } from '../../agendamentos/modelo/Agendamento';
import { Pessoa } from '../../pessoas/model/pessoa';


@Injectable({
  providedIn: 'root'
})

export class CalendariosResolver implements Resolve<Agendamento> {
  constructor(private service: CalendariosService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Agendamento> | Promise<Agendamento> | Agendamento {
    if (route.params && route.params['id']) {
      return this.service.loadById(route.params['id']);
    }
    return of({id:0, data:'', horaInicio:'',  horaFim: '',  pessoa:{_id:'', users:'', identidade:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', acesso:'', ramal:'', caminho:'', dataUltimaPromocao:0, assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}}, assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}, acessorios:[], audiencia:'', evento:'', diex:'', militarLigacao:'' });
  }
}

