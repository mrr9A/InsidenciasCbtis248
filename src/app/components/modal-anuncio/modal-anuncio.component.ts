import { Component, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApisService } from '../../services/apis.service';
import { CommonModule } from '@angular/common';
import { onTimeService } from '../../services/actulizarInfor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-anuncio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-anuncio.component.html',
  styleUrls: ['./modal-anuncio.component.css']
})
export class ModalAnuncioComponent {
  anuncio: any;
  constructor(private onTimeService: onTimeService, private apisService: ApisService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    setInterval(() => {
      this.onTimeService.getActualUser();
    }, 180000);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apisService.getAvisoById(id).subscribe(data => {
        this.anuncio = data;
        //console.log(this.anuncio);
      }
      );
    }
  }


  onClose(): void {
    this.router.navigate(['cbtis248/avisos']);
  }
}
