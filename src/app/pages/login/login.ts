import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef) {}

  ingresar() {
    if (!this.usuario || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.usuario, this.password)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }
}