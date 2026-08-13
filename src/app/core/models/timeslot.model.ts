export interface TimeSlot {
  id: number;
  doctorId: number;
  doctorName?: string;
  date: string;      // ISO 8601 format
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  isAvailable: boolean;
}
