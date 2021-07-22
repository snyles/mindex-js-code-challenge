import {Component, OnInit} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import {DialogService} from '../dialog.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(
    private employeeService: EmployeeService, 
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => {
          console.log(emps)
          this.employees = emps
        }),
        catchError(this.handleError.bind(this))
      ).subscribe();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }

  toggleUpdateModal(employee: Employee) {
    this.dialogService.toggleDialog('update', employee);
  }

  toggleDeleteModal(employee: Employee) {
    this.dialogService.toggleDialog('delete', employee);
  }

  updateEmployee(employee: Employee) {
    this.employeeService.save(employee).subscribe(emp => console.log("updated employee", emp))
  }

  deleteDirectReport(supervisorId: number, directReportId: number) {
    this.employeeService.get(supervisorId).subscribe(sup => {
      console.log("found supervisor", sup)
      if(sup.directReports) {
        const idx = sup.directReports.findIndex(directReportId)
        sup.directReports.splice(idx, 1)
        this.employeeService.save(sup).subscribe(sup => console.log("updated supervisor", sup))
      } else {
        console.log("No direct reports found")
      }
    })
  }
}
