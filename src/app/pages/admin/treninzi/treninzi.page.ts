import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
  IonSelectOption, IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-treninzi',
  templateUrl: './treninzi.page.html',
  styleUrls: ['./treninzi.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonButton, IonButtons, IonIcon, IonInput, IonSelect,
    IonSelectOption, IonDatetime, IonDatetimeButton, IonModal,
    CommonModule, FormsModule
  ]
})
export class TreninziPage implements OnInit {

  treninzi: any[] = [];
  treneri: any[] = [];
  prikaziFormu: boolean = false;
  minDatum: string = new Date().toISOString();

  noviTrening = {
    naziv: '',
    trenerUid: '',
    trenerIme: '',
    datum: new Date().toISOString(),
    kapacitet: 10,
    prijavljeni: 0
  };

  constructor(private firestore: Firestore) {
    addIcons({ addOutline, trashOutline });
  }

  ngOnInit() {
    this.ucitajTreninge();
    this.ucitajTrenere();
  }

  ucitajTreninge() {
    const ref = collection(this.firestore, 'treninzi');
    collectionData(ref, { idField: 'id' }).subscribe(data => {
      // Sortiramo po datumu - najpre nadolazeci treninzi
      this.treninzi = data.sort((a: any, b: any) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime()
      );
    });
  }

  ucitajTrenere() {
    // Ucitavamo sve zaposlene da ih ponudimo kao izbor
    const ref = collection(this.firestore, 'users');
    const q = query(ref, where('role', '==', 'zaposleni'));
    collectionData(q, { idField: 'uid' }).subscribe(data => {
      this.treneri = data;
    });
  }

  otvoriFormu() {
    this.prikaziFormu = true;
  }

  zatvoriFormu() {
    this.prikaziFormu = false;
    this.noviTrening = {
      naziv: '',
      trenerUid: '',
      trenerIme: '',
      datum: new Date().toISOString(),
      kapacitet: 10,
      prijavljeni: 0
    };
  }

  async dodajTrening() {
    if (!this.noviTrening.naziv || !this.noviTrening.trenerUid) {
      alert('Naziv i trener su obavezni!');
      return;
    }

    // Pronalazimo ime trenera na osnovu uid-a
    const trener = this.treneri.find(t => t.uid === this.noviTrening.trenerUid);
    this.noviTrening.trenerIme = trener ? trener.name : '';

    try {
      await addDoc(collection(this.firestore, 'treninzi'), {
        naziv: this.noviTrening.naziv,
        trenerUid: this.noviTrening.trenerUid,
        trenerIme: this.noviTrening.trenerIme,
        datum: this.noviTrening.datum,
        kapacitet: Number(this.noviTrening.kapacitet),
        prijavljeni: 0
      });
      alert('Trening uspešno dodat!');
      this.zatvoriFormu();
    } catch (error) {
      console.error('Greška:', error);
      alert('Greška pri dodavanju treninga!');
    }
  }

  async obrisiTrening(id: string) {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj trening?')) {
      await deleteDoc(doc(this.firestore, 'treninzi', id));
    }
  }
}