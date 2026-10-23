import { Component } from '@angular/core';
import { Product } from '../classes/IProduct';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-product-list-call-service-component',
  standalone: false,
  templateUrl: './product-list-call-service-component.html',
  styleUrl: './product-list-call-service-component.css',
})
export class ProductListCallServiceComponent {
  minPrice: number = 300;
  maxPrice: number = 400;
  products: Product[] = []
  constructor(private ps: ProductService) {
    // this.products = this.ps.getProducts();
  }

  ngOnInit(): void {
    this.filterProducts();
  }

  filterProducts() {
    this.products = this.ps.getProductsByPrice(this.minPrice, this.maxPrice);
  }
}
