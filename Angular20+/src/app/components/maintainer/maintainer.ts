import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Operation } from './operation';
import { MaintainerService } from './maintainer.service';

@Component({
  selector: 'app-maintainer',
  imports: [],
  templateUrl: './maintainer.html',
  styleUrl: './maintainer.css',
})
export class Maintainer {
  op = Operation;

  constructor(private router: Router, private maintainerService: MaintainerService) { }

  manage(m: Operation, path: string) {
    this.maintainerService.setMode(m);
    this.router.navigate([path]);
  }


}
