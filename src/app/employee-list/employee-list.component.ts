import {Component, OnInit} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

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
    // private dialogService: DialogService,
    ) { }

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

  updateEmployee(newEmp) {
    const newEmployee = {
      ...newEmp.employee,
      compensation: newEmp.compensation
    }
    this.employeeService.save(newEmployee).subscribe(emp =>
      this.employees[emp.id-1] = emp)
  }

  deleteDirectReport({supervisorId, reportId}) {
    this.employeeService.get(supervisorId).subscribe(sup => {
      console.log("found supervisor", sup)
      if(sup.directReports) {
        const newReports = sup.directReports.filter(id => id !== reportId)
        const updatedSup = {
          ...sup,
          directReports: newReports
        }
        this.employeeService.save(updatedSup).subscribe(sup => 
          this.employees[sup.id-1] = sup)
      } else {
        console.log("No direct reports found")
      }
    })
  }
}
