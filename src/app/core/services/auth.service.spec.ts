import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should authenticate user, persist session, and expose role signals on login', () => {
    const mockResponse = {
      userId: 10,
      email: 'patient@yourmed.com',
      role: 'Patient',
      token: 'jwt-test-token'
    };

    service.login({ email: 'patient@yourmed.com', password: 'Password123!' }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.userRole()).toBe('Patient');
    expect(service.getToken()).toBe('jwt-test-token');
    expect(JSON.parse(localStorage.getItem('user_session')!)).toEqual(mockResponse);
  });

  it('should NOT create an empty session after register', () => {
    service.register({
      name: 'Jane Doe',
      email: 'jane@yourmed.com',
      password: 'Password123!',
      role: 'Patient'
    }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User created', id: 11, email: 'jane@yourmed.com' });

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.userRole()).toBeNull();
    expect(localStorage.getItem('user_session')).toBeNull();
  });

  it('should clear session and reset signals on logout', () => {
    localStorage.setItem('user_session', JSON.stringify({
      userId: 1,
      email: 'test@yourmed.com',
      role: 'Admin',
      token: 'abc'
    }));

    // Reinstanciar para leer estado inicial desde localStorage
    const freshService = TestBed.runInInjectionContext(() => new AuthService());
    expect(freshService.isAuthenticated()).toBeTrue();

    freshService.logout();
    expect(freshService.isAuthenticated()).toBeFalse();
    expect(freshService.userRole()).toBeNull();
    expect(localStorage.getItem('user_session')).toBeNull();
  });
});