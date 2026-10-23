import { Component, signal } from '@angular/core';
import { ProductHttpHandleErrorService } from '../services/product-http-handle-error-service';
import { Product } from '../classes/IProduct';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-http-handle-error-service-component',
  standalone: false,
  styleUrl: './product-http-handle-error-service-component.css',
  templateUrl: './product-http-handle-error-service-component.html',
})
export class ProductHttpHandleErrorServiceComponent {
  products = signal<Product[]>([]);
  errMessage = signal("")

  constructor(private _service: ProductHttpHandleErrorService) { }

  ngOnInit(): void {
    this._service.getProductList().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        this.errMessage.set(err)
      }
    })
  }
  handleError(error: HttpErrorResponse)
{
  let errorMessage = 'An unknown error occurred!';

  if (error.error instanceof ErrorEvent) {
    // 1. Client-side error (e.g., network issues, subscription errors)
    errorMessage = `Client-side error: ${error.error.message}`;
  } else {
    // 2. Server-side error (e.g., 404 Not Found, 500 Internal Server Error)
    errorMessage = `
      Error Status: ${error.status}
      Status Text: ${error.statusText}
      URL: ${error.url}
      Server Details: ${error.error ? JSON.stringify(error.error) : 'No details available'}
    `;
  }

  // Log to console for debugging purposes
  console.error(errorMessage);

  // Return detailed error message to be handled by the Component
  return throwError(() => new Error(errorMessage));
}
  
}