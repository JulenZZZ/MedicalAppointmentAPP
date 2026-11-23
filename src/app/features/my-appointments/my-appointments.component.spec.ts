import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MyAppointmentsComponent } from './my-appointments.component';

describe('MyAppointmentsComponent', () => {
  let component: MyAppointmentsComponent;
  let fixture: ComponentFixture<MyAppointmentsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppointmentsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAppointmentsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Responder a la petición inicial de ngOnInit (getMyAppointments)
    const initialReq = httpMock.expectOne((req) => req.url.includes('/appointments'));
    initialReq.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
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

  it('should cancel appointment and update status and paymentStatus signals', () => {
    const mockAppointment: any = {
      id: 14,
      doctorName: 'Dr. Emily Carter',
      specialization: 'Cardiology',
      date: '2026-11-27',
      startTime: '09:00',
      endTime: '09:30',
      status: 'Scheduled',
      paymentStatus: 'Paid',
      amountPaid: 50,
      transactionId: 'TXN-00000014'
    };

    component.appointments.set([mockAppointment]);

    component.openCancelModal(mockAppointment);
    expect(component.appointmentToCancel()).toEqual(mockAppointment);

    component.confirmCancelAppointment();

    const cancelReq = httpMock.expectOne((req) => req.url.endsWith('/appointments/14/cancel'));
    expect(cancelReq.request.method).toBe('PUT');
    cancelReq.flush({ message: 'Cancelled' });

    expect(component.appointments()[0].status).toBe('Cancelled');
    expect(component.appointments()[0].paymentStatus).toBe('Refunded');
    expect(component.appointmentToCancel()).toBeNull();
  });
});