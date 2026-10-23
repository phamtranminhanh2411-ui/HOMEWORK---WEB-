import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';
import { Router } from '@angular/router';
import { Product } from '../classes/IProduct';

@Component({
  selector: 'app-service-product-image-event',
  standalone: false,
  styleUrl: './service-product-image-event.css',
  templateUrl: './service-product-image-event.html',
})
export class ServiceProductImageEvent {
  public products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {
    this.products = productService.getProducts();
  }

  viewDetail(product: Product): void {
    this.router.navigate(['service-product-image-event', product.id]);
  }
}
