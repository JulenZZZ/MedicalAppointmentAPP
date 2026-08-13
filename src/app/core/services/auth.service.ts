import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserSession } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Ajusta la URL según el puerto asignado a tu API de .NET (ejemplo: https://localhost:7025/api/Auth)
  private readonly API_URL = 'http://localhost:7108/api/auth';

  // 1. Signal privado con el estado inicial desde localStorage
  private currentUserSignal = signal<UserSession | null>(this.getUserFromStorage());

  // 2. Signals públicos de solo lectura y computados
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem('user_session');
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return this.currentUserSignal()?.token ?? null;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const session: UserSession = {
      userId: response.userId,
      email: response.email,
      role: response.role,
      token: response.token
    };

    localStorage.setItem('user_session', JSON.stringify(session));
    this.currentUserSignal.set(session);
  }

  private getUserFromStorage(): UserSession | null {
    const data = localStorage.getItem('user_session');
    if (!data) return null;
    try {
      return JSON.parse(data) as UserSession;
    } catch {
      return null;
    }
  }
}