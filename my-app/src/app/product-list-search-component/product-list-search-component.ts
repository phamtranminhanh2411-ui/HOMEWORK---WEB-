import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../classes/IProduct';
import { createSlug } from '../classes/SlugHelper';
import { ProductHttpHandleErrorService } from '../services/product-http-handle-error-service';

@Component({
  selector: 'app-product-list-search-component',
  standalone: false,
  styleUrl: './product-list-search-component.css',
  templateUrl: './product-list-search-component.html',
})
export class ProductListSearchComponent {
  // Toàn bộ sản phẩm từ server
  products=signal<Product[]>([]);
  //check error
  errMessage=signal("")
  // Sản phẩm sau khi đã lọc
  filteredProducts = signal<Product[]>([]);
  // Biến giữ giá trị lọc để hiển thị lên UI
  minPrice = signal<number>(100);
  maxPrice = signal<number>(1000);
  public generateSlug = createSlug;

  constructor(private _service:ProductHttpHandleErrorService,
    private router:Router,
    private activateRoute:ActivatedRoute){
  }
  ngOnInit(): void {
    // 1. Tải toàn bộ sản phẩm về trước
    this._service.getProductList().subscribe({
      next: (data) => {
        this.products.set(data);
        this.watchQueryParams();
      },error: (err) =>{
        this.errMessage.set(err)
      }
    });
  }
  private watchQueryParams() {
    this.activateRoute.queryParamMap.subscribe(params => {
      const minParam = params.get('min');
      const maxParam = params.get('max');
      const min = minParam === null ? 100 : Number(minParam);
      const max = maxParam === null ? 1000 : Number(maxParam);
      this.minPrice.set(min);
      this.maxPrice.set(max);
      // Thực hiện lọc logic
      const result = this.products().filter(p => p.price >= min && p.price <= max);
      this.filteredProducts.set(result);
    });
  }

  onFilter(): void {
    const result = this.products().filter(product =>
      product.price >= this.minPrice() && product.price <= this.maxPrice()
    );
    this.filteredProducts.set(result);
  }

  viewDetail(id: string | number): void {
    this.router.navigate(['/products', id]);
  }

  viewDetailSlug(product: Product): void {
    this.router.navigate(['/products', this.generateSlug(product.name, product.id)]);
  }



}
