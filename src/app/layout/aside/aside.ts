import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
