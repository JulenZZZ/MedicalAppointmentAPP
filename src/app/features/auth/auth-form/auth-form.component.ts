import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para el estado de la UI
  isLoginMode = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  // Formulario Reactivo
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: [''],
    role: ['Patient']
  });

  toggleMode(): void {
    this.isLoginMode.update(val => !val);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Ajustar validaciones según el modo
    if (this.isLoginMode()) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.isLoginMode()) {
      const { email, password } = this.authForm.value;
      this.authService.login({ email, password }).subscribe({
        next: () => this.handleLoginSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      this.authService.register(this.authForm.value).subscribe({
        next: () => this.handleRegisterSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleRegisterSuccess(): void {
    this.isLoading.set(false);

    // Cambiar al formulario de Login dejando el email rellenado
    this.isLoginMode.set(true);
    this.authForm.get('name')?.clearValidators();
    this.authForm.get('name')?.updateValueAndValidity();
    this.authForm.patchValue({ name: '', password: '' });
    this.authForm.markAsUntouched();

    this.successMessage.set('Account created successfully! Please sign in to continue.');
  }

  private handleLoginSuccess(): void {
    this.isLoading.set(false);
    const role = this.authService.userRole();
    if (role === 'Patient') {
      this.router.navigate(['/patient']);
    } else if (role === 'Admin' || role === 'Doctor') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  private handleError(err: any): void {
    this.isLoading.set(false);
    if (err.status === 401 || err.status === 400) {
      const serverMsg = typeof err.error === 'string' ? err.error : err.error?.message;
      this.errorMessage.set(serverMsg || 'Invalid credentials or incorrect data provided.');
    } else {
      this.errorMessage.set('A server error occurred. Please try again.');
    }
  }
}