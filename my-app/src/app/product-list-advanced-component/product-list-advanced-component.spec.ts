import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ProductListAdvancedComponent } from './product-list-advanced-component';

describe('ProductListAdvancedComponent', () => {
  let component: ProductListAdvancedComponent;
  let fixture: ComponentFixture<ProductListAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ProductListAdvancedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListAdvancedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
