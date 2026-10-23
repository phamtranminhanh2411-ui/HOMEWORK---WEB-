import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-registration-reactive-component',
  standalone: false,
  styleUrl: './course-registration-reactive-component.css',
  templateUrl: './course-registration-reactive-component.html',
})
export class CourseRegistrationReactiveComponent {
  public regForm: FormGroup = new FormGroup(
    {
      name: new FormControl('Trần Duy Thanh', [
        Validators.required,
        Validators.minLength(3),
        this.customNameValidator
      ]),
      email: new FormControl('thanhtd@uel.edu.vn', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator]),
      confirmPass: new FormControl('', Validators.required)
    },
    { validators: this.passwordMatchValidator }
  );

  customNameValidator(control: AbstractControl): ValidationErrors | null {
    const name = control.value;
    return typeof name === 'string' && /[@#$%^&]/.test(name)
      ? { nameNotMatch: { value: name } }
      : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPass = control.get('confirmPass')?.value;

    if (!password || !confirmPass || password === confirmPass) {
      return null;
    }

    return { mismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (typeof password !== 'string' || password.length === 0) {
      return null;
    }

    const errors: ValidationErrors = {};
    if (password.length < 8) {
      errors['minLength'] = true;
    }
    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
    }
    if (!/[^A-Za-z0-9\s]/.test(password)) {
      errors['specialCharacter'] = true;
    }

    return Object.keys(errors).length > 0 ? { passwordRequirements: errors } : null;
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    const information = JSON.stringify(this.regForm.value);
    alert(`Xử lý dữ liệu:\n${information}`);
  }

  setDefaultValues(): void {
    this.regForm.reset({
      name: 'Trần Duy Thanh',
      email: 'thanhtd@uel.edu.vn',
      password: '',
      confirmPass: ''
    });
  }

}
