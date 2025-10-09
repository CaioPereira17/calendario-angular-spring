import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { VideoConferencia } from '../modelo/VideoConferencia';

import { VideoConferenciaPage } from '../modelo/videoConferencia-page';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenciasService {

  private readonly API = `${environment.apiUrl}api/videoConferencias`;
  private readonly APIPESQ = `${environment.apiUrl}api/videoConferencias/search`;

  constructor(private readonly httpClient: HttpClient) { }

  list(): Observable<VideoConferencia[]> {
    return this.httpClient.get<VideoConferencia[]>(this.API)
    .pipe(
      first(),
      //delay(5000),
      //tap(assessorias => console.log(assessorias))
    );
  }

  list2(termo = '', page = 0, pageSize = 10): Observable<VideoConferenciaPage> {
    return this.httpClient.get<VideoConferenciaPage>(this.APIPESQ, { params: {termo, page, pageSize}})
    .pipe(
      first(),
      //delay(5000),
      //tap(assessorias => console.log(assessorias))
    );
  }

  list3(dataInicio: string | null, dataFim: string | null, page: number, pageSize: number): Observable<VideoConferenciaPage> {
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

    console.log('Parâmetros enviados:', params);

    return this.httpClient.get<VideoConferenciaPage>('/api/videoConferencias/search-agenda', { params });
  }

  getAllVideoConferencias(pageSize: number, pageIndex: number): Observable<VideoConferenciaPage> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('pageSize', pageSize.toString());

      return this.httpClient.get<VideoConferenciaPage>(this.APIPESQ, { params: {pageSize}});
  }


  loadById(id: string){
    return this.httpClient.get<VideoConferencia>(`${this.API}/${id}`);
   }

   save(record: Partial<VideoConferencia>) {
    console.log(record);
    if (record.id != null) {
     // console.log('update');
      return this.update(record);
    } else {

      return this.create(record);
    }
   // console.log('create');
  }

  private create(record: Partial<VideoConferencia>){
    return this.httpClient.post<VideoConferencia>(this.API, record).pipe(first());
  }

  private update(record: Partial<VideoConferencia>) {
    return this.httpClient.put<VideoConferencia>(`${this.API}/${record.id}`, record).pipe(first());

  }

  remove(id: number) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());

  }

}
