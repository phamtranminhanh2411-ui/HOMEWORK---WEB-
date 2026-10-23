import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timeout } from 'rxjs';
import { FashionSearchField, FashionSearchItem, SearchFashion as SearchFashionService } from '../services/search-fashion';

@Component({
  selector: 'app-search-fashion',
  standalone: false,
  styleUrl: './search-fashion.css',
  templateUrl: './search-fashion.html',
})
export class SearchFashion {
  private readonly service = inject(SearchFashionService);
  private readonly destroyRef = inject(DestroyRef);
  query = '';
  field: FashionSearchField = 'fashion_subject';
  limit = 10;
  readonly results = signal<FashionSearchItem[]>([]);
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly error = signal('');
  readonly total = signal(0);

  search() {
    if (this.loading()) return;
    this.error.set('');
    if (!/[\p{L}\p{N}]/u.test(this.query) || this.query.trim().length > 1000) {
      this.error.set('Vui lòng nhập từ khóa có chữ hoặc số, tối đa 1.000 ký tự.');
      return;
    }
    if (!Number.isInteger(this.limit) || this.limit < 1 || this.limit > 100) {
      this.error.set('Số lượng kết quả phải là số nguyên từ 1 đến 100.');
      return;
    }
    this.loading.set(true);
    this.results.set([]);
    this.searched.set(false);
    this.service.search(this.query, this.field, this.limit).pipe(
      timeout(15000), takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: response => {
        this.results.set(response.items);
        this.total.set(response.total);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(error.error?.message || 'Không thể tải kết quả. Kiểm tra kết nối máy chủ và thử lại.');
        this.loading.set(false);
      },
    });
  }

  imageSource(value: string | null | undefined): string {
    const source = (value ?? '').trim();
    if (!source) return '';
    if (/^(data:image\/|https?:\/\/|\/|\.\.?\/)/i.test(source)) return source;
    if (/^[A-Za-z0-9+/=\s]+$/.test(source) && source.length > 100) {
      return `data:image/png;base64,${source}`;
    }
    return source;
  }

  hideBrokenImage(event: Event) {
    (event.target as HTMLImageElement).hidden = true;
  }
}
