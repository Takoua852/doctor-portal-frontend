import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Reaktivität für UI-Zustände
  hidePassword = true;
  loading = false;

  // Login Formular Definition
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const rawValue = this.loginForm.getRawValue();

    this.authService.login(rawValue).subscribe({
      next: () => {
        this.loading = false;
        // Erfolg: Navigiere zum Dashboard
        this.router.navigate(['/dashboard']);
        
        this.snackBar.open('Welcome back to OmniHealth!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        this.loading = false;
        // Fehlerbehandlung (z.B. falsche Credentials)
        const errorMessage = err.status === 401 
          ? 'Invalid email or password.' 
          : 'A system error occurred. Please try again later.';

        this.snackBar.open(errorMessage, 'Retry', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}