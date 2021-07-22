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

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {

    // if employee has direct results, populate array with employee data
    if(this.employee.directReports) {
      const direct = []
      this.employee.directReports.forEach((id) => {
        this.employeeService.get(id).subscribe(emp => direct.push(emp));
      })
      this.directReports = direct;
    }
  }

}
