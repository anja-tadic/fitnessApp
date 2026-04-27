import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { Firestore, collection, query, where, getDocs, getDoc, deleteDoc, doc, updateDoc, increment } from '@angular/fire/firestore';

@Component({
  selector: 'app-moji-termini',
  templateUrl: './moji-termini.page.html',
  styleUrls: ['./moji-termini.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, IonIcon, CommonModule]
})
export class MojiTerminiPage implements OnInit {

  termini: any[] = []; // lista treninga na koje je klijent prijavljen

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    addIcons({ closeCircleOutline });
  }

  ngOnInit() {
    // Cekamo da se korisnik ucita pa tek onda ucitavamo termine
    this.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Korisnik prijavljen:', user.uid); // za debug
        this.ucitajTermine(user.uid);
      }
    });
  }

  async ucitajTermine(klijentUid: string) {
    // Trazimo sve prijave ovog klijenta u kolekciji prijave
    const prijaveRef = collection(this.firestore, 'prijave');
    const q = query(prijaveRef, where('klijentUid', '==', klijentUid));
    const snapshot = await getDocs(q);

    console.log('Broj prijava:', snapshot.size); // za debug

    if (snapshot.empty) {
      this.termini = [];
      return;
    }

    // Za svaku prijavu ucitavamo podatke o treningu direktno po ID-u
    const terminiPromises = snapshot.docs.map(async d => {
      const prijava = d.data();
      console.log('Prijava:', prijava); // za debug
      const treningRef = doc(this.firestore, 'treninzi', prijava['treningId']);
      const treningSnap = await getDoc(treningRef);

      if (treningSnap.exists()) {
        return {
          ...treningSnap.data(),
          treningId: prijava['treningId'],
          prijavaId: d.id // id prijave potreban za otkazivanje
        };
      }
      return null;
    });

    const svi = await Promise.all(terminiPromises);
    this.termini = svi
      .filter(t => t !== null)
      .sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    
    console.log('Termini:', this.termini); // za debug
  }

  // Proveravamo da li klijent moze da otkaze — mora biti najmanje 1h pre treninga
  mozeDaOtkaze(datum: string): boolean {
    const treningVreme = new Date(datum).getTime();
    const sadasnjost = new Date().getTime();
    const razlika = treningVreme - sadasnjost;
    const jedanSat = 60 * 60 * 1000; // 1 sat u milisekundama
    return razlika > jedanSat;
  }

  async otkazi(termin: any) {
    if (!this.mozeDaOtkaze(termin.datum)) {
      alert('Ne možete otkazati trening manje od 1 sat pre početka!');
      return;
    }

    if (confirm('Da li ste sigurni da želite da otkažete ovaj termin?')) {
      try {
        // Brisemo prijavu iz kolekcije prijave
        await deleteDoc(doc(this.firestore, 'prijave', termin.prijavaId));

        // Smanjujemo broj prijavljenih na treningu za 1
        await updateDoc(doc(this.firestore, 'treninzi', termin.treningId), {
          prijavljeni: increment(-1) // smanjujemo za 1
        });

        alert('Termin je uspešno otkazan!');

        // Osvezavamo listu nakon otkazivanja
        const user = this.auth.currentUser;
        if (user) this.ucitajTermine(user.uid);

      } catch (error) {
        console.error('Greška:', error);
        alert('Greška pri otkazivanju!');
      }
    }
  }
}