export interface UserProfile {
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