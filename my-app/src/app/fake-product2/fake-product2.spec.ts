import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FakeProductService } from '../services/fake-product-service';
import { FakeProduct2 } from './fake-product2';

describe('FakeProduct2', () => {
  let component: FakeProduct2;
  let fixture: ComponentFixture<FakeProduct2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FakeProduct2],
      providers: [
        {
          provide: FakeProductService,
          useValue: { getFakeProductData: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FakeProduct2);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
