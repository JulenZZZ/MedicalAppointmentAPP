export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'Patient' | 'Doctor' | 'Admin';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
}

export interface UserSession {
  userId: number;
  email: string;
  role: string;
  token: string;
}