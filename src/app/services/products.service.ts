import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from './../models/product.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError, zip } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// import { checkTime } from './../interceptors/time.interceptor';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/v1/products`;

  constructor(private http: HttpClient) {}

  getAllSimple() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getAll(limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      retry(3),
      map(products =>
        products.map(item => {
          return {
            ...item,
            taxes: item.price > 0 ? 0.19 * item.price : 0,
          };
        }),
      ),
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(this.getOne(id), this.update(id, dto));
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError(() => 'Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(() => 'El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(() => 'No estas permitido');
        }
        return throwError(() => 'Ups algo salio mal');
      }),
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
