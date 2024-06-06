import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Doctor } from '../model/doctor';
import { Appointment } from '../model/appointment';

@Component({
  selector: 'app-doctor-appointment-list',
  templateUrl: './doctor-appointment-list.component.html',
  styleUrls: ['./doctor-appointment-list.component.css']
})
export class DoctorAppointmentListComponent implements OnInit {
  doctors: Doctor[] = [];
appointments:Appointment[]=[];
  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.mainService.get<Appointment[]>('appByDoctorId').subscribe(
      data => {
        this.transformData(data);
      },
      error => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  transformData(appointments: Appointment[]) {
    const doctorMap: { [key: number]: Doctor } = {};

    appointments.forEach(appointment => {
      if (!doctorMap[appointment.doctor_id]) {
        doctorMap[appointment.doctor_id] = {
          id: appointment.doctor_id,
          name: '', // Set doctor name if available in appointment or fetch it separately
          specialty: '', // Set specialty if available in appointment or fetch it separately
          appointments: []
        };
      }
      doctorMap[appointment.doctor_id].appointments.push(appointment);
    });

    this.doctors = Object.values(doctorMap);
  }
}
