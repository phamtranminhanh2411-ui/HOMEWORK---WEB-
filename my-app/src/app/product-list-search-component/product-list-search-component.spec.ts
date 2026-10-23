import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductListSearchComponent } from './product-list-search-component';

describe('ProductListSearchComponent', () => {
  let component: ProductListSearchComponent;
  let fixture: ComponentFixture<ProductListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule.forRoot([])],
      declarations: [ProductListSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
