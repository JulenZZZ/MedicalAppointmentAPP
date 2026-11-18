import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
private router = inject(Router);

  
  specialties = [
    { title: 'General Medicine', iconType: 'stethoscope', desc: 'Primary care and preventive check-ups for the entire family.' },
    { title: 'Pediatrics', iconType: 'baby', desc: 'Specialized growth and healthcare for babies, children, and teens.' },
    { title: 'Cardiology', iconType: 'heart', desc: 'Advanced heart health diagnosis, treatment, and monitoring.' },
    { title: 'Dermatology', iconType: 'sparkles', desc: 'Comprehensive care and modern treatments for your skin health.' },
    { title: 'Dentistry', iconType: 'smile', desc: 'Oral health, routine cleanings, and cosmetic dentistry services.' },
    { title: 'Ophthalmology', iconType: 'eye', desc: 'Eye examinations, vision care, and eye disease prevention.' }
  ];

  // Steps to book
  steps = [
    { number: '01', title: 'Create an Account', desc: 'Sign up in less than 2 minutes to access our online booking platform.' },
    { number: '02', title: 'Select a Specialist', desc: 'Choose the specialty, physician, and time slot that fits your schedule.' },
    { number: '03', title: 'Confirm Appointment', desc: 'Receive immediate confirmation and automated reminders prior to your visit.' }
  ];

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }
}
