import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Employee } from '../employee';

export interface DialogType {
  type: 'update' | 'delete',
  employee: Employee,
  supervisor: number,
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {
  compensation: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogType,
  private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
  }

  saveCompensation(employee: Employee) {
    this.dialogRef.close({type: 'update', compensation: this.compensation, report: employee})
  }

  confirmDelete(report: Employee) {
    this.dialogRef.close({type: 'delete', report})
  }

}
