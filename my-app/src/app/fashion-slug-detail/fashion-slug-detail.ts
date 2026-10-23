import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Fashion } from '../classes/Fashion';
import { FashionAPIService } from '../services/fashion-apiservice';

@Component({
  selector: 'app-fashion-slug-detail', standalone: false,
  templateUrl: './fashion-slug-detail.html', styleUrl: './fashion-slug-detail.css',
})
export class FashionSlugDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(FashionAPIService);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);
  fashion = signal<Fashion | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(() => { this.fashion.set(null); this.error.set(''); this.loading.set(true); }),
      switchMap(params => this.service.getFashionBySlug(params.get('slug') || '').pipe(
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.status === 404 ? 'Không tìm thấy Fashion.'
            : err.status === 400 ? 'Slug Fashion không hợp lệ.'
            : 'Không thể tải Fashion. Vui lòng kiểm tra kết nối server.');
          return of(null);
        }),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => {
      this.loading.set(false);
      if (data) {
        this.fashion.set(Object.assign(new Fashion(), data));
        if (data.slug !== this.route.snapshot.paramMap.get('slug')) {
          this.location.replaceState('/fashion-slug/' + encodeURIComponent(data.slug));
        }
      }
    });
  }
}
