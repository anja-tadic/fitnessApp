import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-qr-kod',
  templateUrl: './qr-kod.page.html',
  styleUrls: ['./qr-kod.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QrKodPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
