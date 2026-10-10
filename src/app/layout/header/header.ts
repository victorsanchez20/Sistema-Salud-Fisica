import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() menuAbierto = false;
  @Output() alternarMenu = new EventEmitter<void>();
}
