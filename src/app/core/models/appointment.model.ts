export interface CreateAppointmentDto {
  timeSlotId: number;
  patientId?: number;
  paymentMethod: string; // 'CreditCard' | 'DebitCard' | 'Simulated'
}

export interface AppointmentResponse {
  id: number;
  timeSlotId: number;
  doctorId: number;
  doctorName: string;
  specialization: string;
  patientId: number;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  transactionId: string;
  amountPaid: number;
}

export interface BookAppointmentRequest {
    timeslotId: number;
    cardNumber: string;
}