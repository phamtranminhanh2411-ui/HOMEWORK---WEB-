import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CourseRegistrationComponent } from './course-registration-component';

describe('CourseRegistrationComponent', () => {
  let component: CourseRegistrationComponent;
  let fixture: ComponentFixture<CourseRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CourseRegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRegistrationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
