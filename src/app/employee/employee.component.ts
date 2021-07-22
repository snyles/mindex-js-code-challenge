import {Component, Input, OnInit} from '@angular/core';
import { take } from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  // @Input() employees: Employee[];
  directReports: Employee[] = [];
  totalReports: number = 0;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {

    // if employee has direct results, populate array with employee data
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

}
