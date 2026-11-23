import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  activeSlide = signal<number>(0);

  heroSlides = [
    {
      title: 'Comprehensive care for you and your family',
      subtitle: 'Book in-person or online consultations with board-certified doctors in minutes.',
      ctaText: 'Explore our doctors',
      ctaLink: '/patient',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80',
      alt: 'Happy family enjoying healthy outdoor time together'
    },
    {
      title: 'Fast access to trusted medical specialists',
      subtitle: 'Choose your preferred schedule, clinic location, or video consultation with instant confirmation.',
      ctaText: 'Book an appointment',
      ctaLink: '/patient',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
      alt: 'Doctor reviewing digital health records with a patient'
    }
  ];
  specialties = [
    {
      title: 'General Medicine & Family Care',
      description: 'Primary consultations, routine check-ups, and preventive health guidance.',
      image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Preventive Health & Diagnostics',
      description: 'Complete laboratory panels and early screening tailored to every life stage.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Pediatrics & Child Wellness',
      description: 'Dedicated care for infants, children, and adolescents in a welcoming environment.',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Dentistry & Oral Care',
      description: 'Modern dental diagnostics, hygiene treatments, and restorative procedures.',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
    }
  ];

  articles = [
    {
      tags: ['Cardiology', 'Preventive Care'],
      title: 'How regular check-ups help prevent cardiovascular risks early',
      excerpt: 'Routine blood pressure monitoring and basic lab tests allow specialists to detect silent risk factors before symptoms appear.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
    },
    {
      tags: ['Daily Health', 'Diagnostics'],
      title: 'Preparing for your first online medical consultation: what to expect',
      excerpt: 'A practical checklist of symptoms, recent test results, and questions to make the most of your virtual appointment.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      tags: ['Nutrition', 'Gastroenterology'],
      title: 'Food intolerances vs. allergies: key differences and testing',
      excerpt: 'Understanding how digestive symptoms differ from immune reactions and when to consult a specialist for accurate diagnosis.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
    }
  ];

  nextSlide(): void {
    this.activeSlide.update(i => (i + 1) % this.heroSlides.length);
  }

  prevSlide(): void {
    this.activeSlide.update(i => (i - 1 + this.heroSlides.length) % this.heroSlides.length);
  }
}