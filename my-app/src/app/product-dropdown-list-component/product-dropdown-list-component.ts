import { Component } from '@angular/core';
import { Product } from '../classes/IProduct';

@Component({
  selector: 'app-product-dropdown-list-component',
  standalone: false,
  styleUrl: './product-dropdown-list-component.css',
  templateUrl: './product-dropdown-list-component.html',
})
export class ProductDropdownListComponent {
  products: Product[] = [
    { id: 1, name: 'Product 1', price: 10, image: 'https://picsum.photos/id/1/200/200' },
    { id: 2, name: 'Product 2', price: 20, image: 'https://picsum.photos/id/20/200/200' },
    { id: 3, name: 'Product 3', price: 30, image: 'https://picsum.photos/id/30/200/200' },
    { id: 4, name: 'Product 4', price: -15, image: 'https://picsum.photos/id/40/200/200' },
    { id: 5, name: 'Product 5', price: -25, image: 'https://picsum.photos/id/50/200/200' },
  ];
}
