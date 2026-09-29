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

  ngOnInit(): void{
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading.set(true);
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

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
