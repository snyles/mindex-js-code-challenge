import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})

export class DialogService {
  private showDialog: boolean = false;
  private dialogType: string = '';
  private subject = new Subject<any>();
  private employee: Employee;

  constructor() { }

  toggleDialog(type: string, employee: Employee): void {
    this.showDialog = !this.showDialog;
    this.dialogType = type;
    this.employee = employee;
    this.subject.next({
      showDialog: this.showDialog, 
      dialogType: this.dialogType,
      employee: this.employee
    });
  }


  onToggle(): Observable<any> {
    return this.subject.asObservable();
  }
}
