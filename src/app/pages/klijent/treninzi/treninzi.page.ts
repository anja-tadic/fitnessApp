import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, query, where, getDocs, addDoc, updateDoc, doc, increment } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-treninzi',
  templateUrl: './treninzi.page.html',
  styleUrls: ['./treninzi.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonButtons, CommonModule]
})
export class TreninziPage implements OnInit {

  treninzi: any[] = []; // lista svih dostupnih treninga

  constructor(
    private firestore: Firestore,
    private auth: Auth // koristimo da znamo koji je klijent prijavljen
  ) {}

  ngOnInit() {
    // Cekamo da se korisnik ucita pa tek onda ucitavamo treninge
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.ucitajTreninge(user.uid);
      }
    });
  }

  async ucitajTreninge(klijentUid: string) {
    // Ucitavamo sve treninge koji su u buducnosti
    const ref = collection(this.firestore, 'treninzi');
    
    collectionData(ref, { idField: 'id' }).subscribe(async data => {
      const sutra = new Date();
      sutra.setDate(sutra.getDate() + 1); // klijent moze da se prijavi najranije 1 dan pre

      // Filtriramo treninge koji su bar sutra ili kasnije
      const dostupni = data.filter((t: any) => new Date(t.datum) >= sutra);

      // Za svaki trening proveravamo da li je klijent vec prijavljen
      const treninziSaStatusom = await Promise.all(
        dostupni.map(async (trening: any) => {
          const prijaveRef = collection(this.firestore, 'prijave');
          const q = query(
            prijaveRef,
            where('treningId', '==', trening.id),
            where('klijentUid', '==', klijentUid)
          );
          const snapshot = await getDocs(q);
          return {
            ...trening,
            prijavljen: !snapshot.empty // true ako je vec prijavljen
          };
        })
      );

      // Sortiramo po datumu
      this.treninzi = treninziSaStatusom.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });
  }

  async prijaviSe(trening: any) {
    const user = this.auth.currentUser;
    if (!user) return;

    // Proveravamo da li je trening bar sutra
    const sutra = new Date();
    sutra.setDate(sutra.getDate() + 1);
    if (new Date(trening.datum) < sutra) {
      alert('Možete se prijaviti najranije 1 dan pre treninga!');
      return;
    }

    // Proveravamo da li ima slobodnih mesta
    if (trening.prijavljeni >= trening.kapacitet) {
      alert('Trening je popunjen!');
      return;
    }

    try {
      // Dodajemo prijavu u kolekciju prijave
      await addDoc(collection(this.firestore, 'prijave'), {
        treningId: trening.id,
        klijentUid: user.uid,
        datum: new Date().toISOString() // kada je prijava napravljena
      });

      // Povecavamo broj prijavljenih na treningu za 1
      await updateDoc(doc(this.firestore, 'treninzi', trening.id), {
        prijavljeni: increment(1)
      });

      alert('Uspešno ste se prijavili na trening!');
    } catch (error) {
      console.error('Greška:', error);
      alert('Greška pri prijavi!');
    }
  }
}