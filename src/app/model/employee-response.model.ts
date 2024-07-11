import { Employee } from './employee.model';

export interface SaveEmployeeResponse {
  isSuccess: boolean;
  message: string;
  employee: Employee;
}