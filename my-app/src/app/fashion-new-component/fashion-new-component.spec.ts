import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FashionNewComponent } from './fashion-new-component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FashionNewComponent', () => {
  let component: FashionNewComponent;
  let fixture: ComponentFixture<FashionNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FashionNewComponent],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FashionNewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
