import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Doctor } from '../models/doctor.model';
import { Observable } from 'rxjs/internal/Observable';
import { TimeSlot } from '../models/timeslot.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  // Ajusta la URL según el puerto asignado a tu API de .NET (ejemplo: https://localhost:7025/api/Auth)
  private readonly API_URL = 'http://localhost:7108/api';

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.API_URL}/doctors`);
  }

  getDoctorById(doctorId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.API_URL}/doctors/${doctorId}`);
  }

  getAvailableTimeSlots(doctorId: number, date: string): Observable<TimeSlot[]> {
    /**
   * Obtiene la lista de turnos/horarios disponibles.
   * Permite filtrar opcionalmente por médico (doctorId) y/o por fecha (date).
   */
    let params = new HttpParams();

    if (doctorId !== undefined && doctorId !== null) {
      params = params.set('doctorId', doctorId.toString());
    }

    if (date && date.trim() !== '') {
      params = params.set('date', date);
    }
    return this.http.get<TimeSlot[]>(`${this.API_URL}/doctors/${doctorId}/available-timeslots`, { params });
  }
}