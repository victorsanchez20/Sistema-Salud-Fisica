import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Aside } from '../aside/aside';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, RouterOutlet, Header, Aside],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  /** Estado del menú lateral en pantallas pequeñas (en escritorio siempre está visible). */
  menuAbierto = false;

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
