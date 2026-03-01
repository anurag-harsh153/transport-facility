import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { APP_CONFIG } from '../tokens/app-config.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly EMPLOYEE_ID_KEY = 'auth_employee_id';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: any
  ) {}

  login(username: string, password: string): Observable<any> {
    const requestUrl = `${this.config.apiBaseUrl}/login`;
    return this.http.post<any>(
      requestUrl,
      { username, password }
    ).pipe(
      tap(response => {
        this.storeTokenAndEmployeeId(response.token, response.employeeId);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.EMPLOYEE_ID_KEY);
    this.router.navigate(['/auth/login']);
  }

  private storeTokenAndEmployeeId(token: string, employeeId: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.EMPLOYEE_ID_KEY, employeeId);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getEmployeeId(): string | null {
    return sessionStorage.getItem(this.EMPLOYEE_ID_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
