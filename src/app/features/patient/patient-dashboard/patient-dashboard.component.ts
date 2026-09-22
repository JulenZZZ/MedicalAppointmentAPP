import { CommonModule } from '@angular/common';
import { Component,inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { TimeSlot } from '../../../core/models/timeslot.model';

@Component({
  selector: 'app-patient-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {
private doctorService = inject(DoctorService);

  // Signals de Estado
  doctors = signal<Doctor[]>([]);
  availableSlots = signal<TimeSlot[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Signals para los Filtros de Búsqueda
  selectedDoctorId = signal<number | null>(null);
  selectedDate = signal<string>('');

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
        this.availableSlots.set(slots);

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
}
