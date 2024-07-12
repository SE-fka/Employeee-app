import { Component, ViewChild, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../service/employee.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';


@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})
//NG modal confirmation
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = false;
  employeeList: any = [];
  dataSource: any = [];
  displayedColumns: string[] = ['sno', 'id', 'name', 'email', 'phone', 'department', 'position', 'actions'];
  
  constructor(
    private router: Router, private modalService: NgbModal,
    private toastr: ToastrService, private httpProvider: EmployeeService
  ) {
    this.paginator = null!;
    this.sort = null!; 
  }

  ngOnInit() {
    this.getAllEmployee();
  }

  async getAllEmployee() {
    this.isLoading = true;
    this.httpProvider.getAllEmployee().subscribe(
      (data: any[]) => {
        if (data != null) {
          this.employeeList = data;
          this.dataSource = new MatTableDataSource(this.employeeList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastr.success('No data found');
        }
      },
      (error: any) => {
        if (error) {
          this.isLoading = false;
          if (error.status === 404) {
            this.toastr.error('Employee not found. Please try again later.');
          } else if (error.status === 500) {
            this.toastr.error('An error occurred on the server. Please try again later.');
          } else {
            this.toastr.error('An APIs error occurred. Please try again later.');
          }
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 500);
        }
      }
    );
  }

  AddEmployee() {
    this.router.navigate(['AddEmployee']);
  }

  deleteEmployeeConfirmation(employee: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then(() => {
        this.deleteEmployee(employee);
      },
      () => { });
  }

  deleteEmployee(employee: any) {
    this.httpProvider.deleteEmployee(employee.id).subscribe((data: any) => {
      if (data != null) {
        var resultData = data;
        if (resultData != null) {
          this.toastr.success("Delete Employee Success");
          this.getAllEmployee();
        }
      }
    },
    () => { });
  }

  //Search and Filter 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Export xlsx
  exportToExcel(data: any[], filename: string = 'export.xlsx') {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, filename);
  }

   //Export csv
  exportToCSV(data: any[], filename: string = 'export.csv') {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    this.downloadCSV(csvData, filename);
  }
  
  downloadCSV(csvData: string, filename: string): void {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}