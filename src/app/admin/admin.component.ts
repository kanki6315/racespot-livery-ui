import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  links = [
    { title: 'Series', fragment: 'series' },
    { title: 'Liveries', fragment: 'liveries' },
    { title: 'Users', fragment: 'users' }
  ];
  activeTab = 'liveries';

  public isLeagueAdmin = this.authenticationService.isLeagueAdmin();
  constructor(
              public router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.router.navigateByUrl('admin/' + this.activeTab);
  }

  changeActiveTab(link: {fragment: string; title: string}) {
    this.activeTab = link.fragment;
    this.router.navigateByUrl('admin/' + link.fragment);
  }

  canBeDisabled(title: string) {
    if (title === 'Liveries') {
      return false;
    }
    return true;
  }
}
