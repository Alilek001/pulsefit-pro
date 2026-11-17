/** Usuario tal como lo devuelve la API de Laravel (/api/login, /api/user). */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'premium' | 'admin';
  weight: number | null;
  height: number | null;
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | null;
}
