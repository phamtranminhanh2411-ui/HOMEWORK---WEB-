import { Component, OnInit, inject, signal } from '@angular/core';
import { Fashion } from '../classes/Fashion';
import { FashionAPIService } from '../services/fashion-apiservice';

@Component({
  selector: 'app-fashion-slug-list', standalone: false,
  templateUrl: './fashion-slug-list.html', styleUrl: './fashion-slug-list.css',
})
export class FashionSlugList implements OnInit {
  private service = inject(FashionAPIService);
  fashions = signal<Fashion[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.getFashions().subscribe({
      next: (data: Fashion[]) => {
        this.fashions.set(data.map(item => Object.assign(new Fashion(), item)));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không thể tải danh sách Fashion. Vui lòng kiểm tra kết nối server.');
        this.loading.set(false);
      },
    });
  }
}
