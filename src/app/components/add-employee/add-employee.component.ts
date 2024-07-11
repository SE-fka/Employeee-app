import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService  } from '../../service/employee.service';
import { Employee } from '../../model/employee.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm: employeeForm = new employeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;

  constructor(private router: Router, private httpProvider: EmployeeService , private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  AddEmployee(isValid: any) {
    this.isSubmitted = true;
  
    if (isValid) {
      // Create the Employee object from the form data 
      const employee: Employee = {
        emp_Id: this.addEmployeeForm.emp_Id,
        name: this.addEmployeeForm.name,
        email: this.addEmployeeForm.email,
        phone: this.addEmployeeForm.phone,
        department: this.addEmployeeForm.department,
        position: this.addEmployeeForm.position
      };
  
      this.httpProvider.saveEmployee(employee).subscribe(
        (response) => {
          if (response!= null) {
            this.toastr.success('Add Employee Success');
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          }
        },
        (error) => {
          this.toastr.error(error.message);
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 500);
        }
      );
    }
  }

}

export class employeeForm {
  emp_Id: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";
  department: string = "";
  position: string = "";
}