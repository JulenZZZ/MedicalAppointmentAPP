import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent implements OnDestroy {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para el estado de la UI
  isLoginMode = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showWakeUpNotice = signal<boolean>(false);

  private wakeUpTimer: ReturnType<typeof setTimeout> | null = null;

  // Formulario Reactivo
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: [''],
    role: ['Patient']
  });

  ngOnDestroy(): void {
    this.clearWakeUpTimer();
  }

  toggleMode(): void {
    this.isLoginMode.update(val => !val);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.showPassword.set(false);
    this.clearWakeUpTimer();

    if (this.isLoginMode()) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.startWakeUpTimer();

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

  private startWakeUpTimer(): void {
    this.clearWakeUpTimer();
    this.wakeUpTimer = setTimeout(() => {
      if (this.isLoading()) {
        this.showWakeUpNotice.set(true);
      }
    }, 3000);
  }

  private clearWakeUpTimer(): void {
    if (this.wakeUpTimer) {
      clearTimeout(this.wakeUpTimer);
      this.wakeUpTimer = null;
    }
    this.showWakeUpNotice.set(false);
  }

  private handleRegisterSuccess(): void {
    this.clearWakeUpTimer();
    this.isLoading.set(false);
    this.isLoginMode.set(true);
    this.authForm.get('name')?.clearValidators();
    this.authForm.get('name')?.updateValueAndValidity();
    this.authForm.patchValue({ name: '', password: '' });
    this.authForm.markAsUntouched();

    this.successMessage.set('Account created successfully! Please sign in to continue.');
  }

  private handleLoginSuccess(): void {
    this.clearWakeUpTimer();
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
    this.clearWakeUpTimer();
    this.isLoading.set(false);
    if (err.status === 401 || err.status === 400) {
      const serverMsg = typeof err.error === 'string' ? err.error : err.error?.message;
      this.errorMessage.set(serverMsg || 'Invalid credentials or incorrect data provided.');
    } else {
      this.errorMessage.set('A server error occurred. Please try again.');
    }
  }
}