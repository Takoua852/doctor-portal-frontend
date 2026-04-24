import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './appointment-form.component.html'
})
export class AppointmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  doctors: Doctor[] = [];
  error = '';
  appointmentId: number | null = null;

  form = this.fb.group({
    doctor: [''],
    patient: [''],
    title: ['', Validators.required],
    description: [''],
    date: [null as Date | null, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.appointmentId = id ? Number(id) : null;

    if (this.role === 'patient') {
      this.loadDoctors();
    }

    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  get role(): string | null {
    return this.authService.getRole();
  }

  get isEditMode(): boolean {
    return this.appointmentId !== null;
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: () => {
        this.error = 'Doctors could not be loaded.';
      }
    });
  }

  loadAppointment(): void {
    if (!this.appointmentId) return;

    this.appointmentService.getAppointment(this.appointmentId).subscribe({
      next: (appointment) => {
        this.form.patchValue({
          title: appointment.title,
          description: appointment.description || '',
          date: appointment.date ? new Date(appointment.date) : null
        });
      },
      error: () => {
        this.error = 'Appointment could not be loaded.';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload: any = {
      title: raw.title,
      description: raw.description,
      date: raw.date ? new Date(raw.date).toISOString() : null
    };

    if (this.isEditMode && this.appointmentId) {
      this.appointmentService.updateAppointment(this.appointmentId, payload).subscribe({
        next: () => {
          this.router.navigate(['/appointments']);
        },
        error: (err) => {
          this.error = err?.error
            ? JSON.stringify(err.error)
            : 'Appointment update failed.';
        }
      });

      return;
    }

    if (this.role === 'patient') {
      payload.doctor = Number(raw.doctor);
    }

    if (this.role === 'doctor') {
      payload.patient = Number(raw.patient);
    }

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.error = err?.error
          ? JSON.stringify(err.error)
          : 'Appointment creation failed.';
      }
    });
  }
}