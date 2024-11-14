import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../../../services/apis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-responsable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-responsable.component.html',
  styleUrl: './info-responsable.component.css'
})
export class InfoResponsableComponent {
  responsable: any;

  constructor(private route: ActivatedRoute, private apiService: ApisService,private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getResponsableById(id).subscribe(data => {
        this.responsable = data;
        console.log(this.responsable);

      });
    }
  }

  onClose(){
    this.router.navigate(['cbtis248/listResponsable']);
  }
}
