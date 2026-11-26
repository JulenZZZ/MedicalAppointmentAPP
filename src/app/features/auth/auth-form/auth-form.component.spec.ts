import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should fill demo patient credentials and trigger login on loginAsDemoPatient()', () => {
  spyOn(component, 'onSubmit');

  component.isLoginMode.set(false); // Simula que estaba en registro
  component.loginAsDemoPatient();

  expect(component.isLoginMode()).toBeTrue();
  expect(component.authForm.value.email).toBe('sarah.jenkins@example.com');
  expect(component.authForm.value.password).toBe('Patient123!');
  expect(component.onSubmit).toHaveBeenCalledTimes(1);
});
});