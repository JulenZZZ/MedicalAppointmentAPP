import { CommonModule, DatePipe } from '@angular/common';
import { Component,computed,inject,OnInit,signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { TimeSlot } from '../../../core/models/timeslot.model';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-patient-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,DatePipe],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
private doctorService = inject(DoctorService);
private fb = inject(FormBuilder);
private appointmentService = inject(AppointmentService);

  // Signals de Estado
  doctors = signal<Doctor[]>([]);
  rawAvailableSlots = signal<TimeSlot[]>([]); //slots originales del servidor
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Signals para los Filtros de Búsqueda
  selectedDoctorId = signal<number | null>(null);
  selectedDate = signal<string>('');

  //Aplica el filtro en cliente garantizando coincidencia de fecha exacta
  availableSlots = computed(() => {
  const doctorId = Number(this.selectedDoctorId());
  const targetDate = this.selectedDate().trim(); // Ejemplo del input: "2026-10-10"

  return this.rawAvailableSlots().filter(slot => {
    // 1. Filtro por Doctor
    const matchesDoctor = !doctorId || doctorId === 0 || slot.doctorId === doctorId;

    // 2. Filtro por Fecha (usando slot.date)
    let matchesDate = true;
    if (targetDate && slot.date) {
      // Tomamos la propiedad 'date' y extraemos solo los primeros 10 caracteres ("YYYY-MM-DD")
      const slotDatePart = String(slot.date).substring(0, 10);
      matchesDate = slotDatePart === targetDate;
    }

      return matchesDoctor && matchesDate;
    });
  });
  // Signals para Modal de Reserva & Pago
  selectedSlotForBooking = signal<TimeSlot | null>(null);
  isBookingModalOpen = signal<boolean>(false);
  isProcessingPayment = signal<boolean>(false);
  bookingSuccess = signal<boolean>(false);
  transactionId = signal<string | null>(null);

  // Formulario de Pago
  paymentForm: FormGroup = this.fb.group({
    cardHolder: ['', [Validators.required]],
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
    cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
  });

  ngOnInit(): void {
    this.loadDoctors();
    this.searchSlots();
  }

  /**
   * Carga la lista inicial de médicos para el filtro desplegable.
   */
  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors.set(data),
      error: () => {
        // En caso de no existir un endpoint dedicado de doctores,
        // no bloqueamos la búsqueda global de turnos.
        console.warn('Could not load independent doctors list.');
      }
    });
  }

  /**
   * Consulta los horarios disponibles aplicando los filtros actuales de médico y fecha.
   */
  searchSlots(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Convierte '0', null o cadenas vacías a undefined
    const rawId = Number(this.selectedDoctorId());
    const docId = rawId > 0 ? rawId : undefined;
    const dateStr = this.selectedDate() || undefined;

    this.doctorService.getAvailableTimeSlots(docId, dateStr).subscribe({
      next: (slots) => {
        console.log('📌 Slots recibidos del backend:', slots);
        this.rawAvailableSlots.set(slots);
        // Si la lista de doctores no se cargó previamente, la extraemos de los slots recibidos
        if (this.doctors().length === 0 && slots.length > 0) {
          const extractedDoctors: Doctor[] = Array.from(
            new Map(
              slots.map(s => [
                s.doctorId, 
                { id: s.doctorId, name: s.doctorName || `Doctor #${s.doctorId}`, email: '', specialization: s.specialization || 'General' }
              ])
            ).values()
          );
          this.doctors.set(extractedDoctors);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load available time slots. Please try again.');
        console.error('Error fetching time slots:', err);
      }
    });
  }

  /**
   * Maneja el cambio de filtros (Selección de doctor o fecha).
   */
  onFilterChange(): void {
    this.searchSlots();
  }

  /**
   * Restablece los filtros de búsqueda a su estado inicial.
   */
  resetFilters(): void {
    this.selectedDoctorId.set(null);
    this.selectedDate.set('');
    this.searchSlots();
  }

  // Abrir Modal con el Slot Seleccionado
  openBookingModal(slot: TimeSlot): void {
    this.selectedSlotForBooking.set(slot);
    this.isBookingModalOpen.set(true);
    this.bookingSuccess.set(false);
    this.transactionId.set(null);
    this.paymentForm.reset();
  }

  closeBookingModal(): void {
    this.isBookingModalOpen.set(false);
    this.selectedSlotForBooking.set(null);
  }

  // Procesar Cita & Pago Simulado
  processBooking(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const slot = this.selectedSlotForBooking();
    if (!slot) return;

    this.isProcessingPayment.set(true);

    const bookingPayload = {
      timeSlotId: slot.id,
      paymentMethod: 'SimulatedCreditCard'
    };

    this.appointmentService.createAppointment(bookingPayload).subscribe({
      next: (res) => {
        this.isProcessingPayment.set(false);
        this.bookingSuccess.set(true);
        this.transactionId.set(res.transactionId || 'TXN-' + Math.floor(100000 + Math.random() * 900000));
        
        // Refrescar la lista de turnos (el reservado ya no aparecerá)
        this.searchSlots();
      },
      error: (err) => {
        this.isProcessingPayment.set(false);
        console.error('Error booking appointment:', err);
        alert('Failed to process appointment booking. Please try again.');
      }
    });
  }
}
