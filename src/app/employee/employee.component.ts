import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;  
  directReports: Employee[] = [];
  totalReports: number = 0;
  @Output() onEditClick: EventEmitter<Employee> = new EventEmitter;
  @Output() onDeleteClick: EventEmitter<Employee> = new EventEmitter;

  constructor(private employeeService: EmployeeService) {
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

  editClick(employee: Employee) {
    // console.log("edit clicked", employee)
    this.onEditClick.emit(employee);
  }

  deleteClick(employee: Employee) {
    // console.log("delete clicked", employee)
    this.onDeleteClick.emit(employee);
  }
}
