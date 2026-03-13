import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  success: boolean;
  message: string;
  passwordSet: boolean;
  email: string;
  token?: string;
  name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  setPassword(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/set-password`, { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminEmail');
  }

  logout() {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
}
