import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent {
  public authService = inject(AuthService);

  // Beispiel-Daten (später kommen diese per API)
  stats = signal([
    { label: 'Total Patients', value: '1,240', icon: 'group', trend: '+12%', color: 'blue' },
    { label: 'Appointments', value: '18', icon: 'calendar_today', trend: 'Today', color: 'green' },
    { label: 'Pending Results', value: '5', icon: 'pending_actions', trend: 'Action req.', color: 'orange' },
    { label: 'Total Earnings', value: '$4,250', icon: 'payments', trend: '+5%', color: 'purple' }
  ]);

  todayAppointments = signal([
    { time: '09:00 AM', patient: 'Sarah Connor', type: 'Checkup', status: 'In Progress' },
    { time: '10:30 AM', patient: 'James Miller', type: 'Consultation', status: 'Waiting' },
    { time: '01:00 PM', patient: 'Elena Rodriguez', type: 'Blood Test', status: 'Scheduled' }
  ]);

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}