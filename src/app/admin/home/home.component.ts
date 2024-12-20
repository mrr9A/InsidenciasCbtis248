import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { MenuAdminComponent } from '../component/menu-admin/menu-admin.component';
import { CommonModule } from '@angular/common';
import { CardAdminPerfilComponent } from "../component/card-admin-perfil/card-admin-perfil.component";
import { onTimeService } from '../../services/actulizarInfor.service';
import { CardsAddComponent } from '../component/cards-add/cards-add.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuAdminComponent, CommonModule, /* CardAdminPerfilComponent */ CardsAddComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private onTimeService : onTimeService){}
  ngOnInit() {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
  }

}
