import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

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