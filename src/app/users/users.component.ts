import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { BackendMethod, Remult } from 'remult';

import { DialogService } from '../common/dialog';
import { Roles } from './roles';
import { GridSettings } from '@remult/angular/interfaces';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  users = new GridSettings(this.remult.repo(User), {
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 2,

    orderBy: { name: "asc" },
    rowsInPage: 100,

    columnSettings: users => [
      users.name
    ],
    rowButtons: [{
      name: 'Reset Password',
      click: async () => {

        if (await this.dialog.yesNoQuestion("Are you sure you want to delete the password of " + this.users.currentRow.name)) {
          await User.resetPassword(this.users.currentRow.id);
          this.dialog.info("Password deleted");
        };
      }
    }
    ],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name)
    },
  });




  ngOnInit() {
  }

}
