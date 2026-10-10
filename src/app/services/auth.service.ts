import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly API = this.url('/api/auth');

  login(username: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, { username, password }).pipe(
      tap(admin => localStorage.setItem('admin', JSON.stringify(admin)))
    );
  }

  getAdmin() {
    return JSON.parse(localStorage.getItem('admin') || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getAdmin();
  }

  logout() {
    localStorage.removeItem('admin');
  }
}
