import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// Wir definieren ein Interface für den User-Status
export interface UserState {
  token: string;
  role: string;
  username: string;
  email: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'http://127.0.0.1:8000/api';

  // Das Signal speichert nun das ganze User-Objekt oder null
  currentUserSig = signal<UserState | null>(this.getInitialUser());

  private getInitialUser(): UserState | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email'); // <--- Laden
      const user_id = localStorage.getItem('user_id');

      if (token && role && username && email) {
        return {
          token,
          role,
          username,
          email, 
          user_id: Number(user_id)
        };
      }
    }
    return null;
  }
  login(data: { email: string; password: string }) {
    // Hinweis: Prüfe ob dein Backend /login oder /login/ (mit Slash) braucht
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        if (isPlatformBrowser(this.platformId)) {
          // Alles im LocalStorage speichern
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('username', res.username); // Wichtig für die Anzeige
          localStorage.setItem('user_id', String(res.user_id));
          localStorage.setItem('email', res.email);
          // Das Signal mit den echten Daten füttern
          this.currentUserSig.set({
            token: res.token,
            role: res.role,
            username: res.username,
            user_id: res.user_id,
            email: res.email
          });
        }
      })
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }

  // Hilfsmethoden bleiben einfach
  isLoggedIn(): boolean {
    return !!this.currentUserSig();
  }

  getRole(): string | null {
    return this.currentUserSig()?.role || null;
  }
}