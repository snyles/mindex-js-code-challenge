import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs';
import { DialogService } from '../dialog.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {
  showDialog: boolean = false;
  dialogType: string;
  employee: Employee;
  subscription: Subscription;

  constructor(public dialog:MatDialog, private dialogService: DialogService) { 
    this.subscription = this.dialogService.onToggle().subscribe((value) => {
      this.showDialog = value.showDialog;
      this.dialogType = value.dialogType;
      this.employee = value.employee;
      if(this.showDialog) this.openDialog(this.dialogType, this.employee)
    })
  }

  ngOnInit(): void {
  }

  openDialog(type: string, employee: Employee) {
    const dialogRef = this.dialog.open(DialogContents, {
      data: {
        type,
        employee
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.dialogService.toggleDialog(null, null)
    })
  }

}

export interface DialogType {
  type: 'update' | 'delete',
  employee: Employee,
}

@Component({
  selector: 'dialog-contents',
  templateUrl: 'dialog.contents.html',
  styleUrls: ['./dialog.contents.css']
})

export class DialogContents {
  compensation: number;
  @Output() onSaveCompensation: EventEmitter<any> = new EventEmitter()
  @Output() onDeleteReport: EventEmitter<any> = new EventEmitter()

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogType) { }

  saveCompensation() {
    console.log("save it!", this.compensation);
    this.onSaveCompensation.emit()
  }

  deleteDirectReport() {
    console.log("delete direct report");
    this.onDeleteReport.emit()
  }
}