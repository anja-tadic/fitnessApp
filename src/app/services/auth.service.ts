import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, collection, collectionData, query, where, addDoc, orderBy, getDocs, increment} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root', // kao sigleton, postoji jedan primerak ovoga
})
export class AuthService {

  // Observable — tok podataka koji se menja tokom vremena
  currentUser$ = user(this.auth);  //user() FireBase fja koja vraca observale

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registracija
  async register(email: string, password: string, role: string, name: string, gender: string, phone: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password); // kreira se nalog u FireBase Auth
    const user = userCredential.user;

    await setDoc(doc(this.firestore, 'users', user.uid), { // U Firestore bazi kreira se dokument sa ovim podacima
      uid: user.uid,
      email: email,
      name: name,
      role: role,
      gender: gender,
      phone: phone
    });

    return userCredential;
  }

  // Prijava
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password); // proverava email i lozinku u firebase auth
  }

  // Odjava
  async logout() {
    return signOut(this.auth); // odjavljuje korisnika iz firebase auth
  }

  // Dohvati ulogu korisnika
  async getUserRole(uid: string) {
    const docRef = doc(this.firestore, 'users', uid); // trazi dok sa tim id
    const docSnap = await getDoc(docRef); // adresa dokumenta u firestore bazi
    if (docSnap.exists()) {
      return docSnap.data()['role'];
    }
    return null;
  }

  // Dohvati sve klijente
  getKlijenti(): Observable<any[]> {
  const ref = collection(this.firestore, 'users');
  const q = query(ref, where('role', '==', 'klijent')); // filtriramo samo klijente
  return collectionData(q, { idField: 'uid' });
}

  // Dohvati jednog korisnika po uid, provera qr koda
  async getUserById(uid: string) {
    const docRef = doc(this.firestore, 'users', uid); // referenca na dokument
    const docSnap = await getDoc(docRef); // dohvata dokument
    return docSnap.exists() ? docSnap.data() : null; // vraca podatke ili null
  }

  // Azuriranje korisnika — koristi se kada admin edituje korisnika
  async updateUser(uid: string, data: any) {
    const docRef = doc(this.firestore, 'users', uid); // referenca na dokument
    await updateDoc(docRef, data); // azurira samo prosledjena polja
  }
  async deleteUser(uid: string) {
  await deleteDoc(doc(this.firestore, 'users', uid)); // brise iz firestore
}
// Dohvati sve trenere (zaposlene)
getTreneri(): Observable<any[]> {
  const ref = collection(this.firestore, 'users');
  const q = query(ref, where('role', '==', 'zaposleni')); // filtriramo po roli
  return collectionData(q, { idField: 'uid' });
}

// Dohvati sve treninge
getTreninzi(): Observable<any[]> {
  const ref = collection(this.firestore, 'treninzi');
  return collectionData(ref, { idField: 'id' });
}

// Dodaj trening
async dodajTrening(trening: any) {
  await addDoc(collection(this.firestore, 'treninzi'), trening);
}

// Obrisi trening
async obrisiTrening(id: string) {
  await deleteDoc(doc(this.firestore, 'treninzi', id));
}

// Dohvati termine klijenta
async getTerminiKlijenta(klijentUid: string): Promise<any[]> { // vraca niz objekata
  const prijaveRef = collection(this.firestore, 'prijave'); // trazimo sve dokumente
  const q = query(prijaveRef, where('klijentUid', '==', klijentUid)); // gd eje klijentUid = ulogovanom korisniku
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  const terminiPromises = snapshot.docs.map(async d => { // prolaizmo kroy sve dokumente i pravimo za svaki Promise
    const prijava = d.data();
    const treningRef = doc(this.firestore, 'treninzi', prijava['treningId']);// idmeo kroz niz treninga i iz njega uzimamo tacan trening
    const treningSnap = await getDoc(treningRef);

    if (treningSnap.exists()) {
      return {
        ...treningSnap.data(), // svi podaci tr
        treningId: prijava['treningId'], //dofajemo trid
        prijavaId: d.id // dodajemo prijavaid zbog otkazivanja
      };
    }
    return null;
  });

  const svi = await Promise.all(terminiPromises);
  return svi
    .filter(t => t !== null)
    .sort((a: any, b: any) =>
      new Date(a.datum).getTime() - new Date(b.datum).getTime()
    );
}

// Otkazi termin
async otkaziTermin(prijavaId: string, treningId: string): Promise<void> {
  await deleteDoc(doc(this.firestore, 'prijave', prijavaId));
  await updateDoc(doc(this.firestore, 'treninzi', treningId), {
    prijavljeni: increment(-1)
  });
}
// Provjeri da li je klijent vec prijavljen na trening
async jePrijavljen(klijentUid: string, treningId: string): Promise<boolean> {
  const prijaveRef = collection(this.firestore, 'prijave');
  const q = query(prijaveRef, 
    where('klijentUid', '==', klijentUid),
    where('treningId', '==', treningId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty; // true ako postoji prijava
}

// Prijavi klijenta na trening
async prijaviNaTrening(klijentUid: string, treningId: string): Promise<void> {
  // dodajemo prijavu u kolekciju prijave
  await addDoc(collection(this.firestore, 'prijave'), {
    klijentUid,
    treningId,
    datumPrijave: new Date().toISOString()
  });

  // povecavamo broj prijavljenih na treningu
  await updateDoc(doc(this.firestore, 'treninzi', treningId), {
    prijavljeni: increment(1)
  });
}

}