import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SidebarComponent, 
    TopbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  
  isSidebarVisible = true;
  showLayout = false;

  ngOnInit() {
    // Wir prüfen bei jeder Routen-Änderung, ob wir Sidebar/Topbar zeigen wollen.
    // Das verhindert, dass auf der Landing-Page (/) die Sidebar erscheint, 
    // selbst wenn man technisch noch eingeloggt ist.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayoutVisibility();
    });

    // Initialer Check
    this.updateLayoutVisibility();
  }

  private updateLayoutVisibility() {
    const currentRoute = this.router.url;
    const publicRoutes = ['/', '/login', '/register'];
    
   
    this.showLayout = !!this.authService.currentUserSig() && !publicRoutes.includes(currentRoute);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}