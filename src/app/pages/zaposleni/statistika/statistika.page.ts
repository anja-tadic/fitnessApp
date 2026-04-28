import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Firestore, collection, getDocs, query, orderBy } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import { personOutline, calendarOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.page.html',
  styleUrls: ['./statistika.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon, CommonModule]
})
export class StatistikaPage implements OnInit {

  prisustva: any[] = [];
  ukupno: number = 0;
  danas: number = 0;

  constructor(private firestore: Firestore) {
    addIcons({ personOutline, calendarOutline, timeOutline });
  }

  async ngOnInit() {
    await this.ucitajStatistiku();
  }

  async ucitajStatistiku() {
    const prisustvoRef = collection(this.firestore, 'prisustvo');
    const q = query(prisustvoRef, orderBy('datum', 'desc'));
    const querySnap = await getDocs(q);

    this.prisustva = querySnap.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        datumFormatiran: new Date(data['datum']).toLocaleDateString('sr-RS', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });

    this.ukupno = this.prisustva.length;

    // Broj dolazaka danas
    const danas = new Date();
    const pocetak = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate()).toISOString();
    const kraj = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate() + 1).toISOString();
    this.danas = this.prisustva.filter(p => p.datum >= pocetak && p.datum < kraj).length;
  }
}
