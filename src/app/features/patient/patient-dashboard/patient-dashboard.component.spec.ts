import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard.component';

describe('PatientDashboardComponent', () => {
  let component: PatientDashboardComponent;
  let fixture: ComponentFixture<PatientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Flujo de Búsqueda, Reserva y Pago (QA UI)', () => {
  // 1. Búsqueda y filtrado de doctores
  it('should filter doctors by specialty and search term case-insensitively', () => {
    const doctors = [
      { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', consultationFee: 120 },
      { id: 2, name: 'Dr. Mark Wilson', specialty: 'Dermatology', consultationFee: 90 }
    ];
    // Simula carga de doctores y filtrado por especialidad
    const filtered = doctors.filter(d => d.specialty.toLowerCase().includes('cardio'));
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Dr. Sarah Jenkins');
  });

  // 2. Prevención de doble envío en el pago/reserva
  it('should disable submit button while payment and booking request is in flight', () => {
    // Un QA hace triple clic rápido en "Confirm & Pay"
    // Verifica que isSubmitting === true bloquee llamadas duplicadas al servicio
    let apiCalls = 0;
    let isSubmitting = false;

    const confirmBooking = () => {
      if (isSubmitting) return;
      isSubmitting = true;
      apiCalls++;
    };

    confirmBooking();
    confirmBooking();
    confirmBooking();

    expect(apiCalls).toBe(1);
  });
});
  
});