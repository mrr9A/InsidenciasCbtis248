import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { onTimeService } from '../../services/actulizarInfor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-modal-historial',
  standalone: true,
  imports: [],
  templateUrl: './modal-historial.component.html',
  styleUrl: './modal-historial.component.css'
})
export class ModalHistorialComponent {
  incidencia: any;

  constructor(private onTimeService: onTimeService, private route: ActivatedRoute,private apisService: ApisService,private router: Router) { }

  ngOnInit(): void {
/*     setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000); */
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apisService.getInsideById(id).subscribe(data => {
        this.incidencia = data;
        //console.log(this.incidencia);
      }
      );
    }
  }

  onClose(): void {
    this.router.navigate(['cbtis248/historialIncidencias']);
  }

}
