import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { CourseRegistrationReactiveComponent } from './course-registration-reactive-component';

describe('CourseRegistrationReactiveComponent', () => {
  let component: CourseRegistrationReactiveComponent;
  let fixture: ComponentFixture<CourseRegistrationReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CourseRegistrationReactiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRegistrationReactiveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rejects special characters in the name', () => {
    const nameControl = component.regForm.get('name')!;
    nameControl.setValue('Thanh@');

    expect(nameControl.errors?.['nameNotMatch']).toBeTruthy();
  });

  it('rejects mismatched passwords', () => {
    component.regForm.patchValue({ password: 'secret1', confirmPass: 'secret2' });

    expect(component.regForm.errors?.['mismatch']).toBe(true);
  });

  it('requires a long password with uppercase and special characters', () => {
    const passwordControl = component.regForm.get('password')!;

    passwordControl.setValue('abcdefg');
    expect(passwordControl.errors?.['passwordRequirements']).toEqual({
      minLength: true,
      uppercase: true,
      specialCharacter: true
    });

    passwordControl.setValue('Abcdefg1');
    expect(passwordControl.errors?.['passwordRequirements']).toEqual({
      specialCharacter: true
    });

    passwordControl.setValue('Abcdef1!');
    expect(passwordControl.errors).toBeNull();
  });

  it('allows submission when required values are valid and passwords match', () => {
    component.regForm.patchValue({
      name: 'Thanh Nguyen',
      email: 'thanh@example.com',
      password: 'Secret1!',
      confirmPass: 'Secret1!'
    });

    expect(component.regForm.valid).toBe(true);
  });

  it('submits valid form values', () => {
    component.regForm.patchValue({
      name: 'Thanh Nguyen',
      email: 'thanh@example.com',
      password: 'Secret1!',
      confirmPass: 'Secret1!'
    });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    component.onSubmit();

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('thanh@example.com'));
    alertSpy.mockRestore();
  });
});
