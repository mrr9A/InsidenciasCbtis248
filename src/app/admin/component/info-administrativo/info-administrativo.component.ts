import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-administrativo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-administrativo.component.html',
  styleUrl: './info-administrativo.component.css'
})
export class InfoAdministrativoComponent {
  administrativo: any;

  constructor(private route: ActivatedRoute, private apiService: ApisService,private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getAdministrativoById(id).subscribe(data => {
        this.administrativo = data;
        //console.log(this.responsable);
      });
    }
  }

  onClose(){
    this.router.navigate(['cbtis248/listAdministrativos']);
  }
}
