import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../core/services/appointment.service';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './appointment-list.component.html'
})
export class AppointmentListComponent implements OnInit {
  private appointmentService = inject(AppointmentService);

  appointments: Appointment[] = [];
  error = '';

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: () => {
        this.error = 'Failed to load appointments';
      }
    });
  }

  deleteAppointment(id: number) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: () => {
        this.error = 'Delete failed';
      }
    });
  }
}