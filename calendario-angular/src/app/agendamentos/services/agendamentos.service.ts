import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { Agendamento } from '../modelo/Agendamento';

import { AgendamentoPage } from '../modelo/agendamento-page';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {

  private readonly API = `${environment.apiUrl}api/agendamentos`;
  private readonly APIPESQ = `${environment.apiUrl}api/agendamentos/search`;
  private readonly APIPESQBUSCA = `${environment.apiUrl}api/agendamentos/search-busca`;

  constructor(private readonly httpClient: HttpClient) { }

  list(): Observable<Agendamento[]> {
    return this.httpClient.get<Agendamento[]>(this.API)
    .pipe(
      first(),
      //delay(5000),
      //tap(assessorias => console.log(assessorias))
    );
  }

  list2(termo = '', page = 0, pageSize = 10): Observable<AgendamentoPage> {
    return this.httpClient.get<AgendamentoPage>(this.APIPESQ, { params: {termo, page, pageSize}})
    .pipe(
      first(),
      //delay(5000),
      //tap(assessorias => console.log(assessorias))
    );
  }

  list3(dataInicio: string | null, dataFim: string | null, page: number, pageSize: number): Observable<AgendamentoPage> {
    const params: any = {

      page,
      pageSize,
    };

    if (dataInicio) {
      params.dataInicio = dataInicio;
    }
    if (dataFim) {
      params.dataFim = dataFim;
    }

    //console.log('Parâmetros enviados:', params);

    return this.httpClient.get<AgendamentoPage>('/api/agendamentos/search-agenda', { params });
  }

  getAllAgendamentos(pageSize: number, pageIndex: number): Observable<AgendamentoPage> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('pageSize', pageSize.toString());

      return this.httpClient.get<AgendamentoPage>(this.APIPESQ, { params: {pageSize}});
  }




  // list3(dataInicio= '', dataFim= '', page: number, pageSize: number): Observable<AgendamentoPage> {
  //   const params: any = {
  //     dataInicio,
  //     dataFim,
  //     page,
  //     pageSize
  //   };

  //   if (dataInicio) {
  //     params.dataInicio = dataInicio; // Adiciona o parâmetro dataInicio
  //   }
  //   if (dataFim) {
  //     params.dataFim = dataFim; // Adiciona o parâmetro dataFim
  //   }

  //   return this.httpClient.get<AgendamentoPage>(this.APIPESQBUSCA, { params })
  // }




  loadById(id: string){
    return this.httpClient.get<Agendamento>(`${this.API}/${id}`);
   }

   save(record: Partial<Agendamento>) {
    console.log(record);
    if (record.id != null) {
     // console.log('update');
      return this.update(record);
    } else {

      return this.create(record);
    }
   // console.log('create');
  }

  private create(record: Partial<Agendamento>){
    return this.httpClient.post<Agendamento>(this.API, record).pipe(first());
  }

  private update(record: Partial<Agendamento>) {
    return this.httpClient.put<Agendamento>(`${this.API}/${record.id}`, record).pipe(first());

  }

  remove(id: number) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());

  }

}
