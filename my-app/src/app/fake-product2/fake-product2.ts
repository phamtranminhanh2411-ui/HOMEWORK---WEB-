import { Component, OnInit, signal } from '@angular/core';
import { IFakeProduct } from '../classes/IFakeProduct';
import { FakeProductService } from '../services/fake-product-service';

@Component({
  selector: 'app-fake-product2',
  standalone: false,
  styleUrl: './fake-product2.css',
  templateUrl: './fake-product2.html',
})
export class FakeProduct2 implements OnInit {
  products = signal<IFakeProduct[]>([]);
  errMessage = signal('');
  isLoading = signal(true);

  constructor(private _service: FakeProductService) {}

  ngOnInit(): void {
    this._service.getFakeProductData().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errMessage.set(error instanceof Error ? error.message : String(error));
        this.isLoading.set(false);
      },
    });
  }
}
