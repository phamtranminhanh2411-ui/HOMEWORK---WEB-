import { Injectable } from '@angular/core';
import { Product } from '../classes/IProduct';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    products: Product[] = [
        { id: 'p1', name: 'Coca', price: 100, image: 'assets/h1.svg' },
        { id: 'p2', name: 'Pepsi', price: 300, image: 'assets/h2.svg' },
        { id: 'p3', name: 'Sting', price: 200, image: 'assets/h3.svg' },
      ];
      constructor() {}
      getProducts()
        {
            return this.products;
        }

      getProductsByPrice(minPrice: number, maxPrice: number): Product[]
        {
            return this.products.filter((product) => product.price >= minPrice && product.price <= maxPrice);
        }
      
}
