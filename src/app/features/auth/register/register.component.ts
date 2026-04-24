import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // ActivatedRoute hinzugefügt
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Für den Button-Spinner

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('repeated_password');
  return password && confirm && password.value !== confirm.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatInputModule, MatButtonModule, MatCardModule, 
    MatFormFieldModule, MatIconModule, MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Route injecten für den Parameter

  error = '';
  hidePassword = true;
  loading = false; // Neu: Loading State für den Button

  titles = [
    { value: 'dr', viewValue: 'Dr.' },
    { value: 'prof_dr', viewValue: 'Prof. Dr.' },
    { value: 'mr', viewValue: 'Mr.' },
    { value: 'ms', viewValue: 'Ms.' }
  ];

  specialties = [
    { value: 'GP', viewValue: 'General Practitioner' },
    { value: 'CARD', viewValue: 'Cardiologist' },
    { value: 'DERM', viewValue: 'Dermatologist' },
    { value: 'PED', viewValue: 'Pediatrician' },
    { value: 'PSY', viewValue: 'Psychiatrist' },
    { value: 'ORTHO', viewValue: 'Orthopedist' },
    { value: 'GYNE', viewValue: 'Gynecologist' },
    { value: 'NEURO', viewValue: 'Neurologist' },
    { value: 'ONC', viewValue: 'Oncologist' },
    { value: 'ENDO', viewValue: 'Endocrinologist' }
  ];

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['patient', Validators.required],
    title: [''],
    specialty: [null],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeated_password: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    // Liest ?role=doctor von der Landing Page aus
    const roleParam = this.route.snapshot.queryParamMap.get('role');
    if (roleParam === 'doctor' || roleParam === 'patient') {
      this.form.patchValue({ role: roleParam });
    }
  }

  get isDoctor() {
    return this.form.get('role')?.value === 'doctor';
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true; // Spinner starten
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false; // Spinner stoppen
        if (err.error && typeof err.error === 'object') {
          const firstKey = Object.keys(err.error)[0];
          this.error = err.error[firstKey];
        } else {
          this.error = 'Registration failed. Please check your data.';
        }
      }
    });
  }
}