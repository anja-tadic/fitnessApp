import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, barbell, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
import jsQR from 'jsqr';
 
@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonCard, IonCardContent, CommonModule]
})
export class QrPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
 
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
 
  korisnik: any = null;
  validan: boolean = false;
  nevalidan: boolean = false;
  poruka: string = '';
  skeniranje: boolean = false;
 
  private stream: MediaStream | null = null;
  private animationId: number | null = null;
 
  constructor(private router: Router) {
    addIcons({ qrCodeOutline, checkmarkCircleOutline, closeCircleOutline, barbell, logOutOutline });
  }
 
  ngOnInit() {}
 
  ngOnDestroy() {
    this.stopKamera();
  }
 
  async startSkeniranje() {
    this.korisnik = null;
    this.validan = false;
    this.nevalidan = false;
    this.poruka = '';
    this.skeniranje = true;
 
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
 
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      video.play();
 
      video.onloadedmetadata = () => {
        this.skenirajFrame();
      };
    } catch (error) {
      this.poruka = 'Greška pri pristupu kameri!';
      this.nevalidan = true;
      this.skeniranje = false;
    }
  }
 
  skenirajFrame() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
 
    if (!ctx || !this.skeniranje) return;
 
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    

    if (code) {
      this.stopKamera();
      //alert('Skenirano: ' + code.data);
      this.proveriQR(code.data);
    } else {
      this.animationId = requestAnimationFrame(() => this.skenirajFrame());
    }
  }
 
  stopKamera() {
    this.skeniranje = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
 
  proveriQR(uid: string) {
    this.authService.getUserById(uid).subscribe({
      
      next: (korisnik) => {
          //alert('Korisnik: ' + JSON.stringify(korisnik));
        if (korisnik) {
          this.korisnik = korisnik;
 
          this.authService.snimiPrisustvo(uid).subscribe({
            next: (rezultat) => {
              if (rezultat === 'ok') {
                this.validan = true;
                this.nevalidan = false;
              } else if (rezultat === 'nema_treninga') {
                this.korisnik = null;
                this.validan = false;
                this.nevalidan = true;
                this.poruka = 'Nema aktivnog treninga u ovom trenutku!';
              } else if (rezultat === 'nije_prijavljen') {
                this.korisnik = null;
                this.validan = false;
                this.nevalidan = true;
                this.poruka = 'Klijent nije prijavljen na trenutni trening!';
              } else if (rezultat === 'vec_evidentiran') {
                this.validan = true;
                this.nevalidan = false;
                this.poruka = 'Klijent je već evidentiran!';
              }
            },
            error: () => {
              this.nevalidan = true;
            }
          });
        } else {
          this.validan = false;
          this.nevalidan = true;
          this.poruka = 'QR kod nije validan!';
        }
      },
      error: () => {
        this.nevalidan = true;
      }
    });
  }
 
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}