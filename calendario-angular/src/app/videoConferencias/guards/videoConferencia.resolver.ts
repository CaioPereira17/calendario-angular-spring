import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { VideoConferencia } from '../modelo/VideoConferencia';
import { VideoConferenciasService } from '../services/videoConferencias.service';

@Injectable({
  providedIn: 'root'
})

export class VideoConferenciaResolver {
  constructor(private  videoConferenciasService: VideoConferenciasService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VideoConferencia> | Promise<VideoConferencia> | VideoConferencia {
    if (route.params && route.params['id']) {
      return this.videoConferenciasService.loadById(route.params['id']);
    }
    return of({id:0, dataInicio:'', dataFim:'', horaInicio:'',  horaFim: '',  pessoa:{_id:'', users:'', identidade:'', tipoAcesso:'', nome:'', nomeGuerra:'', postoGraduacao:'', liberado:'', ramal:'', caminho:'', dataUltimaPromocao:'25/11/2025', assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}}, assessoria:{_id:'', sigla:'', descricao:'', assessoriaPai:null, ordem:0, interna:false}, acessorios:[], audiencia:'', evento:'', diex:'', militarLigacao:'' });
  }
}


