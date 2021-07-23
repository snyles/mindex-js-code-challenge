import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;  
  directReports: Employee[] = [];
  totalReports: number = 0;
  @Output() onEditConfirm: EventEmitter<any> = new EventEmitter;
  @Output() onDeleteConfirm: EventEmitter<any> = new EventEmitter;

  constructor(private employeeService: EmployeeService,
    public dialog:MatDialog
    ) {
  }

  ngOnInit(): void {
    // if employee has direct reports, populate array with employee data
    // and add indirect reports to reports total
    if(this.employee.directReports) {
      this.totalReports = this.employee.directReports.length
      const direct = []
      this.employee.directReports.forEach((id) => {
        this.employeeService.get(id).subscribe(emp => {
          this.totalReports += emp.directReports ? emp.directReports.length : 0;
          direct.push(emp)
        });
      })
      this.directReports = direct;
    }
  }

  //open dialog function
  openDialog(type: string, directReport: Employee) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        employee: directReport,
      }
    })
    dialogRef.afterClosed().subscribe((result) => {
      console.log("result", result)
      if (result?.type) {
        result.type === 'update' ? 
          this.editConfirm(result.compensation, result.report)
          :
          this.deleteConfirm(result.report)
      }
    })
  }

  editConfirm(newCompensation: number, report) {
    // console.log("edit clicked", employee)
    // this.openDialog('update', employee, null)
    const newEmp = {
      employee: report,
      compensation: newCompensation
    }
    this.onEditConfirm.emit(newEmp);
  }

  deleteConfirm(report: Employee) {
    const deleteData = {
      supervisorId: this.employee.id,
      reportId: report.id
    }
    this.onDeleteConfirm.emit(deleteData);
  }
}
