import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ActivatedRoute } from '@angular/router';
import { JwtDecoder } from '../jwt.decode';  // Ensure correct import path

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  cases: any[] = [];
  appointments: any; 
  patients: any[] = [];

  constructor(
    private mainService: MainService,
    private route: ActivatedRoute,
    private jwtDecoder: JwtDecoder // Inject JwtDecoder service
  ) { }

  ngOnInit(): void {
    this.fetchPatient();
    // this.fetchCases();
  }

  fetchPatient(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const patientId = this.jwtDecoder.getUserId(token);
      if (patientId !== null) {
        const endpoint = `getP`;
        this.mainService.get<any>(endpoint).subscribe(
          response => {
            if (response.success) {
              this.patients = response.data; 
            } else {
              console.error('API response was not successful:', response);
            }
          },
          error => {
            console.error('Error fetching patient data:', error);
          }
        );
      } else {
        console.error('No patientId found in token');
      }
    } else {
      console.error('No token found in localStorage');
    }
  }

  fetchCases(patientId:number): void {
   
    
        const endpoint = `getCase/${patientId}`;
        this.mainService.get<any>(endpoint).subscribe(
          response => {
            if (response.success) {
              if (Array.isArray(response.data)) {
                this.cases = response.data;
              } else if (response.data && typeof response.data === 'object') {
                this.cases = [response.data];
              } else {
                console.error('Unexpected data structure for cases:', response.data);
              }

              this.cases.forEach((caseItem: any) => {
                const caseId = caseItem.id;
                this.fetchAppointments(caseId);
              });
            } else {
              console.error('API response indicates failure:', response);
            }
          },
          error => {
            console.error('Error fetching cases data:', error);
          }
        );
      } 
   
  

  fetchAppointments(caseId: number): void {
    const endpoint = `getApp/case/${caseId}`;
    this.mainService.get<any>(endpoint).subscribe(
      response => {
        if (Array.isArray(response.data)) {
          const appointments = response.data;
          const caseToUpdate = this.cases.find(c => c.id === caseId);
          if (caseToUpdate) {
            caseToUpdate.appointments = appointments;
          }
        } else if (response && typeof response === 'object') {
          const appointment = response;
          const caseToUpdate = this.cases.find(c => c.id === caseId);
          if (caseToUpdate) {
            caseToUpdate.appointments = [appointment];
          }
        } else {
          console.error(`Unexpected data structure for appointments:`, response);
        }
      },
      error => {
        console.error(`Error fetching appointments data for case ${caseId}:`, error);
      }
    );
  }

  // Methods to handle actions
  edit(row: any): void {
    console.log('Edit:', row);
    // Implement edit logic here
  }

  delete(row: any): void {
    console.log('Delete:', row);
    // Implement delete logic here
  }

  view(row: any): void {
    const patientId = row.id; 
    this.fetchCases(patientId);

    console.log('View:', row);
    console.log('Patient ID:', patientId);
    console.log('View:', row);
  }

  // Methods to handle edit and delete actions for cases
  editCase(id: any): void {
    console.log('Edit Case:', id);
    // Implement edit case logic here
  }

  deleteCase(id: any): void {
    console.log('Delete Case:', id);
    // Implement delete case logic here
  }

  // Methods to handle edit and delete actions for appointments
  editAppointment(id: any): void {
    console.log('Edit Appointment:', id);
    // Implement edit appointment logic here
  }

  deleteAppointment(id: any): void {
    console.log('Delete Appointment:', id);
    // Implement delete appointment logic here
  }
}
