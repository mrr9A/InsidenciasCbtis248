import { Component } from '@angular/core';
import { CardProfileComponent } from "../../components/card-profile/card-profile.component";
import { MenuComponent } from "../../components/menu/menu.component";
import { onTimeService } from '../../services/actulizarInfor.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CardProfileComponent, MenuComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
constructor(private onTimeService : onTimeService){}
ngOnInit() {
  setInterval(() => {
    this.onTimeService.getActualUser();
  }, 180000);
}
}
