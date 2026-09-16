import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Appointment, BookAppointmentRequest } from '../models/appointment.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:7108/api/appointments';

    /**
    * Reserva un horario disponible (TimeSlot) para el paciente autenticado.
   */
    bookAppointment(request: BookAppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, request);
    }
    /**
   * Obtiene todas las citas agendadas pertenecientes al paciente con sesión activa.
   */
  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments`);
  }

  /**
   * Cancela una cita médica existente indicando su ID.
   */
  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }

}