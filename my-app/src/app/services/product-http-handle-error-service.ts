import { inject, Injectable } from '@angular/core';
import { catchError, map, retry, throwError } from 'rxjs';
import { Product } from '../classes/IProduct';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductHttpHandleErrorService {
  private _url: string = "/datasets/1.json";
  private _http = inject(HttpClient);

  getProductList(): Observable<Product[]> {
    return this._http.get<Product[]>(this._url)
      .pipe(
        retry(3),
        catchError(this.handleError)    
      );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProductList().pipe(
      map((products: Product[]) => products.find(p => p.id === id)),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
