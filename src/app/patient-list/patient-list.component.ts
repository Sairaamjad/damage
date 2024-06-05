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
    this.fetchCases();
  }

  fetchPatient(): void {
    const token = localStorage.getItem('token');
    console.log(token,"patient here token")
    console.log(token, "token from listing component");
    if (token) {
      const patientId = this.jwtDecoder.getUserId(token);
      if (patientId !== null) {
        console.log('Patient ID:', patientId);
        const endpoint = `getP/${patientId}`;
        console.log('Constructed URL:', endpoint);
        this.mainService.get<any>(endpoint).subscribe(
          response => {
            console.log('Patient API response:', response);
            if (response.success) {
              console.log('Patient Data:', response.data);
              this.patients = [response.data]; // Ensure patients is an array
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

  fetchCases(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const patientId = this.jwtDecoder.getUserId(token);
      if (patientId !== null) {
        const endpoint = `getCase/${patientId}`;
        this.mainService.get<any>(endpoint).subscribe(
          response => {
            console.log('Cases Response:', response);
            if (response.success) {
              console.log('Cases Data:', response.data);
              if (Array.isArray(response.data)) {
                this.cases = response.data;
              } else if (response.data && typeof response.data === 'object') {
                console.log('Single case object found, wrapping in an array');
                this.cases = [response.data];
              } else {
                console.error('Unexpected data structure for cases:', response.data);
              }

              this.cases.forEach((caseItem: any) => {
                const caseId = caseItem.id;
                console.log(caseId, "case ID");
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
      } else {
        console.error('No patientId found in token');
      }
    } else {
      console.error('No token found in localStorage');
    }
  }

 
  fetchAppointments(caseId: number): void {
    const endpoint = `getApp/case/${caseId}`;
    this.mainService.get<any>(endpoint).subscribe(
      response => {
        console.log(`Appointments for case ${caseId}:`, response);
        if (Array.isArray(response.data)) {
          const appointments = response.data;
          // Find the case corresponding to the fetched appointments
          const caseToUpdate = this.cases.find(c => c.id === caseId);
          // Update the case's appointments property
          if (caseToUpdate) {
            caseToUpdate.appointments = appointments;
          }
        } else if (response && typeof response === 'object') {
          console.log('Single appointment object found, wrapping in an array');
          const appointment = response;
          // Find the case corresponding to the fetched appointment
          const caseToUpdate = this.cases.find(c => c.id === caseId);
          // Update the case's appointments property
          if (caseToUpdate) {
            caseToUpdate.appointments = [appointment]; // Wrap single appointment in an array
          }
        } else {
          console.error(`Unexpected data structure for appointments:`, response);
        }
        console.log('Updated Cases:', this.cases);
      },
      error => {
        console.error(`Error fetching appointments data for case ${caseId}:`, error);
      }
    );
  }
  

  // Methods to handle edit and delete actions for cases
  editCase(id: any): void {
    // Implement edit case logic here
  }

  deleteCase(id: any): void {
    // Implement delete case logic here
  }

  // Methods to handle edit and delete actions for appointments
  editAppointment(id: any): void {
    // Implement edit appointment logic here
  }

  deleteAppointment(id: any): void {
    // Implement delete appointment logic here
  }
}
