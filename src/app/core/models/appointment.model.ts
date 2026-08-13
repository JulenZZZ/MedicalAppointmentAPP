export interface Appointment { 
    id: number;
    timeslotId: number;
    doctorId: number;
    doctorName?: string;
    doctorSpecialization?: string;
    patientId: number;
    patientName?: string;
    createdAt: string; // ISO 8601 format
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    paymentStatus: 'Pending' | 'Paid' | 'Refunded';

}

export interface BookAppointmentRequest {
    timeslotId: number;
    cardNumber: string;
}