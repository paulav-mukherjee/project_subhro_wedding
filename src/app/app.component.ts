import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface InviteImage {
  id: number;
  path: string;
  title: string;
}

export interface InviteData {
  title: string;
  eventDate: string;
  venue: string;
  venue_date: string;
  venue2: string;
  venue2_date: string;
  Contact: string;
  images: InviteImage[];
}

export interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface Petal {
  left: string;
  duration: string;
  delay: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  title = 'project_subhro_marriage';
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  // ── Data ───────────────────────────────────────────────────────────────────
  readonly inviteData: InviteData = {
    title: 'Subhra Weds Ishani',
    eventDate: '2026-03-09T18:30:00',
    venue: "Bride's residence, Madanpur, Nadia, 741245",
    venue_date: '9th March 2026',
    venue2: 'Hemanta Bhaban, Madanpur, Nadia, 741245',
    venue2_date: '12 March 2026',
    Contact: '7003717430',
    images: [
      { id: 0, path: '/assets/images/background.jpeg', title: 'zoom' },
      { id: 1, path: '/assets/images/banner_landscape.jpeg', title: '' },
      { id: 2, path: '/assets/images/banner_portrait.jpeg', title: '' },
      // {id : 3, path: '/assets/images/landing.jpeg',          title: '' },

      { id: 4, path: '/assets/images/background1.jpeg', title: '' },
      { id: 5, path: '/assets/images/background2.jpeg', title: '' },
      // {id : 6, path: '/assets/images/background4.jpeg',          title: '' },

      { id: 7, path: '/assets/images/DSC05975 copy1.jpg.jpeg', title: '' },
      { id: 8, path: '/assets/images/RAAM5412 copy1.jpg.jpeg', title: '' },
    ],
  };

  // ── State ──────────────────────────────────────────────────────────────────
  countdown: Countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
  petals: Petal[] = [];
  modalImage: InviteImage | null = null;
  isPlaying = false;
  galleryRevealed = false;
  eventRevealed = false;

  // ── Private ────────────────────────────────────────────────────────────────
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.generatePetals(18);
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  // ── Scroll Observer ────────────────────────────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void {
    const scrollY = window.scrollY + window.innerHeight;

    if (!this.galleryRevealed) {
      const galleryEl = document.getElementById('gallery');
      if (galleryEl && scrollY > galleryEl.offsetTop + 100) {
        this.galleryRevealed = true;
        this.cdr.markForCheck();
      }
    }

    if (!this.eventRevealed) {
      const eventEl = document.getElementById('event');
      if (eventEl && scrollY > eventEl.offsetTop + 100) {
        this.eventRevealed = true;
        this.cdr.markForCheck();
      }
    }
  }

  // ── Countdown ──────────────────────────────────────────────────────────────
  private startCountdown(): void {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(this.inviteData.eventDate).getTime();
      const distance = target - now;

      if (distance <= 0) {
        this.countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        this.cdr.markForCheck();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown = {
        days: this.pad(days),
        hours: this.pad(hours),
        minutes: this.pad(minutes),
        seconds: this.pad(seconds),
      };
      this.cdr.markForCheck();
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // ── Petals ─────────────────────────────────────────────────────────────────
  private generatePetals(count: number): void {
    this.petals = Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 8}s`,
    }));
  }

  // ── Gallery / Modal ────────────────────────────────────────────────────────
  openModal(img: InviteImage): void {
    this.modalImage = img;
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.modalImage = null;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  // ── Music ──────────────────────────────────────────────────────────────────
  toggleMusic(): void {
    const audio = this.audioPlayerRef?.nativeElement;
    if (!audio) return;

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay policy: user interaction required
      });
    }
    this.isPlaying = !this.isPlaying;
    this.cdr.markForCheck();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  getImage(id: any): string {
    const found = this.inviteData.images.find(img => img.id == id);
    return found ? found.path : '';
  }
}
