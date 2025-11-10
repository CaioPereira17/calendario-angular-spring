import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Agendamento } from '../modelo/Agendamento';
import { AgendamentosService } from '../services/agendamentos.service';

@Injectable({
  providedIn: 'root'
})

export class AgendamentoResolver {
  constructor(private readonly service: AgendamentosService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Agendamento> | Promise<Agendamento> | Agendamento {
    if (route.params && route.params['id']) {
      return this.service.loadById(route.params['id']);
    }
    return of({id:0, dataInicio:'', dataFim:'', horaInicio:'',  horaFim: '',  pessoa:{_id:'', users:'', identidade:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', liberado:'', ramal:'', caminho:'', dataUltimaPromocao:'25/11/2025', assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}}, assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}, acessorios:[], audiencia:'', evento:'', diex:'', militarLigacao:'' });
  }
}


