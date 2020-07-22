import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  links = [
    { title: 'Series', fragment: 'series' },
    { title: 'Users', fragment: 'users' }
  ];
  active = 'series';
  constructor(public route: ActivatedRoute,
              public router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl('admin/' + this.active);
  }

  changeActiveTab(link: {fragment: string; title: string} | {fragment: string; title: string}) {
    this.active = link.fragment;
    this.router.navigateByUrl('admin/' + link.fragment);
  }
}
