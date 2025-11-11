import { Injectable } from '@angular/core';

import { Pessoa } from '../model/pessoa';
import { HttpClient } from '@angular/common/http';
import { first, Observable, } from 'rxjs';
import { Assessoria } from '../../assessorias/model/assessoria';
import { PessoaPage } from '../model/pessoa-page';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  private readonly API = `${environment.apiUrl}api/pessoas`;
  private readonly APIPESQ = `${environment.apiUrl}api/pessoas/search`;

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  list(termo = '', page = 0, pageSize = 10) {

    return this.httpClient.get<PessoaPage>(this.APIPESQ, { params: {termo, page, pageSize}})
    .pipe(
      first(),
      //delay(5000),
      //tap(pessoas => console.log(pessoas)),

    );
  }

  reativarPessoa(id: number): Observable<void> {
    return this.httpClient.put<void>(`api/pessoas/reativar/${id}`, null);
  }

  listarInativas(page = 0, pageSize = 10): Observable<PessoaPage> {
    return this.httpClient.get<PessoaPage>('api/pessoas/inativas', {
      params: { page, pageSize }
    });
  }


  listPessCompl() {

    return this.httpClient.get<Pessoa[]>(this.API)
    .pipe(
      first(),
      //delay(5000),
      //tap(pessoas => console.log(pessoas)),

    );
  }


  assessorias() {
    return this.httpClient.get<Assessoria[]>(this.API)
    .pipe(
      first(),
      //delay(5000),
      //tap(assessorias => console.log(assessorias)),

    );


  }

  // listAssessCompl() {
  //   return this.httpClient.get<Assessoria[]>(this.API)
  //   .pipe(
  //     first(),
  //     //delay(5000),
  //     //tap(assessorias => console.log(assessorias)),

  //   );


  // }

  loadById(id: string){
   return this.httpClient.get<Pessoa>(`${this.API}/${id}`);
  }


  save(record: Partial<Pessoa>) {
    //console.log(record);
    if (record._id) {
      console.log('update', record);
      return this.update(record);
    }
   // console.log('create');
    return this.create(record);
  }

  private create(record: Partial<Pessoa>){
    return this.httpClient.post<Pessoa>(this.API, record).pipe(first());
  }

  private update(record: Partial<Pessoa>) {
    return this.httpClient.put<Pessoa>(`${this.API}/${record._id}`, record).pipe(first());

  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());

  }

  getPessoaTIInfo(pessoaId: string) {
    return this.httpClient.get<any>(`${this.API}/${pessoaId}/ti-info`);
  }
  
  updatePessoaTIInfo(pessoaId: string, tiInfo: any) {
    return this.httpClient.put<any>(`${this.API}/${pessoaId}/ti-info`, tiInfo);
  }

}


