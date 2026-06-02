export interface User {
  id: string;
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | null;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: 'MALE' | 'FEMALE';
  timezone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}