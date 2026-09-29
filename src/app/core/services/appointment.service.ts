import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppointmentResponse, CreateAppointmentDto } from '../models/appointment.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

    private http = inject(HttpClient);
    private readonly apiUrl = 'https://localhost:7108/api/appointments';

    /**
    * Reserva un horario disponible (TimeSlot) para el paciente autenticado.
   */
    createAppointment(dto: CreateAppointmentDto): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(this.apiUrl, dto);
    }
    /**
   * Obtiene todas las citas agendadas pertenecientes al paciente con sesión activa.
   */
    getMyAppointments(): Observable<AppointmentResponse[]> {
      return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/my-appointments`);
    }

    /**
     * Cancela una cita médica existente indicando su ID.
     */
    cancelAppointment(appointmentId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
    }

}