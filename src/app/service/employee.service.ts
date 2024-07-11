import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee.model';
import { SaveEmployeeResponse } from '../model//employee-response.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://json-server-np7d.onrender.com/employees';

  //private apiUrl = 'http://localhost:3000/employees';


  constructor(private http: HttpClient) {}

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }
  
  getEmployeeDetailById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }

  saveEmployee(employee: Employee): Observable<HttpResponse<SaveEmployeeResponse>> {
    return this.http.post<SaveEmployeeResponse>(this.apiUrl, employee, { observe: 'response' })
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}