import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // <--- Adicionado HttpParams
import { first, Observable } from 'rxjs';

import { Pessoa } from '../model/pessoa';
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

  /**
   * Método unificado de listagem com paginação e filtros (termo e mês)
   */
  list(termo: string = '', assessoria: string = '', page: number = 0, pageSize: number = 10, mesAniversario: number | '' = ''): Observable<PessoaPage> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString()) // <--- MUDAR DE 'size' PARA 'pageSize'
      .set('termo', termo);

    if (mesAniversario) {
      params = params.set('mesNascimento', mesAniversario.toString());
    }
    if (termo) params = params.set('termo', termo);
    if (assessoria) params = params.set('assessoria', assessoria); // Add this



    return this.httpClient.get<PessoaPage>(this.APIPESQ, { params }).pipe(first());
  }

  reativarPessoa(id: number): Observable<void> {
    return this.httpClient.put<void>(`${this.API}/reativar/${id}`, null); // Corrigido caminho relativo
  }

  listarInativas(page = 0, pageSize = 10): Observable<PessoaPage> {
    // Corrigido para usar HttpParams para consistência
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<PessoaPage>(`${this.API}/inativas`, { params });
  }

  listPessCompl() {
    return this.httpClient.get<Pessoa[]>(this.API).pipe(first());
  }

  assessorias() {
    return this.httpClient.get<Assessoria[]>(this.API).pipe(first());
  }

  loadById(id: string) {
    return this.httpClient.get<Pessoa>(`${this.API}/${id}`).pipe(first());
  }

  save(record: Partial<Pessoa>) {
    if (record._id) {
      console.log('update', record);
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Pessoa>) {
    return this.httpClient.post<Pessoa>(this.API, record).pipe(first());
  }

  private update(record: Partial<Pessoa>) {
    return this.httpClient.put<Pessoa>(`${this.API}/${record._id}`, record).pipe(first());
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

  getPessoaTIInfo(pessoaId: string) {
    return this.httpClient.get<any>(`${this.API}/${pessoaId}/ti-info`).pipe(first());
  }

  updatePessoaTIInfo(pessoaId: string, tiInfo: any) {
    return this.httpClient.put<any>(`${this.API}/${pessoaId}/ti-info`, tiInfo).pipe(first());
  }

  exportarPdf(termo: string, assessoria: string, mes: number | ''): Observable<Blob> {
    let params = new HttpParams()
      .set('termo', termo)
      .set('assessoria', assessoria)
      
    if (mes) {
      params = params.set('mesNascimento', mes.toString());
    }

    // responseType: 'blob' é fundamental para baixar arquivos
    return this.httpClient.get(`${this.API}/exportar`, { 
      params: params, 
      responseType: 'blob' 
    });
  }
}