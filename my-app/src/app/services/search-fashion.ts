import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type FashionSearchField = 'fashion_subject' | 'fashion_detail';
export interface FashionSearchItem {
  _id: string;
  style: string;
  fashion_subject: string;
  fashion_detail: string;
  fashion_image: string;
  jaccardSimilarity: number;
}
export interface FashionSearchResponse {
  items: FashionSearchItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class SearchFashion {
  private readonly http = inject(HttpClient);

  search(query: string, field: FashionSearchField, limit: number) {
    return this.http.get<FashionSearchResponse>('/fashions/search/query', {
      params: { q: query.trim(), field, limit },
    });
  }
}
