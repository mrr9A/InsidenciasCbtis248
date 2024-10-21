import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(
    private router: Router
  ) {}

  goToHistory() {
    this.router.navigateByUrl('cbtis248/historialIncidencias');
  }

}
