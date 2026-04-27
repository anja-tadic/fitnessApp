import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-qr-skener',
  templateUrl: './qr-skener.page.html',
  styleUrls: ['./qr-skener.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QrSkenerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
