import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentResponse } from '../../core/models/appointment.model';
import { AppointmentService } from '../../core/services/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-appointments',
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {

  private appointmentService = inject(AppointmentService);

  appointments = signal<AppointmentResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Estados para el modal de cancelación
  appointmentToCancel = signal<AppointmentResponse | null>(null);
  isCancelling = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.errorMessage.set('Could not load your appointments. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  openCancelModal(appointment: AppointmentResponse): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.appointmentToCancel.set(appointment);
  }

  closeCancelModal(): void {
    if (!this.isCancelling()) {
      this.appointmentToCancel.set(null);
    }
  }

  confirmCancelAppointment(): void {
    const target = this.appointmentToCancel();
    if (!target) return;

    this.isCancelling.set(true);
    this.appointmentService.cancelAppointment(target.id).subscribe({
      next: () => {
        // Actualizamos el estado localmente sin recargar toda la página
        this.appointments.update(list =>
          list.map(item =>
            item.id === target.id
              ? { ...item, status: 'Cancelled', paymentStatus: 'Refunded' }
              : item
          )
        );
        this.isCancelling.set(false);
        this.appointmentToCancel.set(null);
        this.successMessage.set(`Appointment #${target.id} with ${target.doctorName} has been cancelled and refunded.`);
      },
      error: (err) => {
        console.error('Error cancelling appointment:', err);
        this.isCancelling.set(false);
        this.appointmentToCancel.set(null);
        this.errorMessage.set(err.error?.message || 'Could not cancel the appointment. Please try again.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-[#00529B]/10 text-[#00529B] border-[#00529B]/20';
      case 'completed':
        return 'bg-[#007A3D]/10 text-[#007A3D] border-[#007A3D]/20';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
}