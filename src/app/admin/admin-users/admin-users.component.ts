import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UsersService} from '../../services/users.service';
import {Observable} from 'rxjs';
import {ErrorModalComponent} from '../../error-modal/error-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  isResetting = false;
  users: User[] = [];
  constructor(private userService: UsersService,
              private _modalService: NgbModal) {
    userService.getUnverifiedUsers().subscribe((users) => {
      this.users = users.sort((a, b) => new Date(b.lastInviteSent).getTime() - new Date(a.lastInviteSent).getTime());
    });
  }

  ngOnInit(): void {
  }

  resetInvitation(user: User) {
    if (this.isResetting) {
      return;
    }
    this.isResetting = true;

    this.userService.resetAccount(user.id).subscribe(() => {
      this.isResetting = false;
      const userIndex = this.users.filter(l => l === user);
      if (userIndex.length > 0) {
        const index = this.users.indexOf(userIndex[0], 0);
        if (index > -1) {
          this.users.splice(index, 1);
        }
      }
    }, (error) => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isResetting = false;
    });
  }

  getDeletionTitle(user: User) {
    return `Reset ${user.emailAddress}?`;
  }

  getDeletionButton(user: User) {
    return `Reset`;
  }

  getDeletionMessage(user: User) {
    return `User's invite will be deleted and they will be able to try the verification process again!`;
  }
}
