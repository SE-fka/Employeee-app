import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm: employeeForm = new employeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;
  employeeId: any;

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
    private httpProvider: EmployeeService) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.getEmployeeDetailById();
  }

  getEmployeeDetailById() {
    this.httpProvider.getEmployeeDetailById(this.employeeId).subscribe(
      (data: any) => {
        this.editEmployeeForm.id = data.id;
        this.editEmployeeForm.emp_Id = data.emp_Id;
        this.editEmployeeForm.name = data.name;
        this.editEmployeeForm.email = data.email;
        this.editEmployeeForm.phone = data.phone;
        this.editEmployeeForm.department = data.department;
        this.editEmployeeForm.position = data.position;
      },
      (error: any) => {
        if (error.status === 404) {
          this.toastr.error('Employee not found.');
          this.router.navigate(['/Home']);
        } else {
          this.toastr.error(error.message);
          this.router.navigate(['/Home']);
        }
      }
    );
  }
 
  EditEmployee(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider.updateEmployee(
        this.editEmployeeForm.id,
        this.editEmployeeForm
      ).subscribe(
        (data: any) => {
          if (data != null) {
            this.toastr.success('Update Employee Success');
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          }
        },
        (error: any) => {
          if (error.status === 404) {
            this.toastr.error('Employee not found. Unable to update.');
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          } else {
            this.toastr.error(error.message);
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          }
        }
      );
    }
  }

}

export class employeeForm {
  id: number = 0;
  emp_Id: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";
  department: string = "";
  position: string = "";
}
