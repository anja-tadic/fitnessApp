import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Database, ref, set, get, update, remove, push, query, orderByChild, equalTo, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Observable koji prati trenutno prijavljenog korisnika
  currentUser$ = user(this.auth);

  constructor(private auth: Auth, private db: Database) {}

  // Registracija — kreira nalog u Auth i cuva podatke u Realtime Database
  async register(email: string, password: string, role: string, name: string, gender: string, phone: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const u = userCredential.user;

    // U Realtime Database podaci se cuvaju kao users/uid/...
    await set(ref(this.db, 'users/' + u.uid), {
      uid: u.uid,
      email: email,
      name: name,
      role: role,
      gender: gender,
      phone: phone
    });

    return userCredential;
  }

  // Prijava korisnika
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Odjava korisnika
  async logout() {
    return signOut(this.auth);
  }

  // Nadji ulogu korisnika po uid
  async getUserRole(uid: string): Promise<string> {
    const snapshot = await get(ref(this.db, 'users/' + uid));
    if (snapshot.exists()) {
      return snapshot.val()['role'];
    }
    return '';
  }

  // Nadji jednog korisnika po uid
  async getUserById(uid: string): Promise<any> {
    const snapshot = await get(ref(this.db, 'users/' + uid));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // Nadji sve korisnike kao Observable (lista se automatski osvezava)
  getKorisnici(): Observable<any[]> {
    return new Observable(observer => {
      const usersRef = ref(this.db, 'users');
      onValue(usersRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          // Pretvaramo objekat u niz
          const lista = Object.keys(data).map(key => ({
            ...data[key],
            uid: key
          }));
          observer.next(lista);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Nadji sve klijente
  getKlijenti(): Observable<any[]> {
    return new Observable(observer => {
      const usersRef = ref(this.db, 'users');
      onValue(usersRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.keys(data)
            .map(key => ({ ...data[key], uid: key }))
            .filter(u => u.role === 'klijent'); // filtriramo samo klijente
          observer.next(lista);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Nadji sve trenere
  getTreneri(): Observable<any[]> {
    return new Observable(observer => {
      const usersRef = ref(this.db, 'users');
      onValue(usersRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.keys(data)
            .map(key => ({ ...data[key], uid: key }))
            .filter(u => u.role === 'zaposleni'); // filtriramo samo zaposlene
          observer.next(lista);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Azuriranje korisnika
  async updateUser(uid: string, data: any) {
    await update(ref(this.db, 'users/' + uid), data);
  }

  // Brisanje korisnika
  async deleteUser(uid: string) {
    await remove(ref(this.db, 'users/' + uid));
  }

  // Nadji sve treninge kao Observable
  getTreninzi(): Observable<any[]> {
    return new Observable(observer => {
      const treninziRef = ref(this.db, 'treninzi');
      onValue(treninziRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.keys(data)
            .map(key => ({ ...data[key], id: key }))
            .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
          observer.next(lista);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Nadji treninge za odredjenog trenera
  getTreninziZaTrenera(trenerUid: string): Observable<any[]> {
    return new Observable(observer => {
      const treninziRef = ref(this.db, 'treninzi');
      onValue(treninziRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.keys(data)
            .map(key => ({ ...data[key], id: key }))
            .filter(t => t.trenerUid === trenerUid) // filtriramo po treneru
            .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
          observer.next(lista);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Dodaj trening
  async dodajTrening(trening: any) {
    // push() automatski generise jedinstveni kljuc kao id
    await push(ref(this.db, 'treninzi'), trening);
  }

  // Obrisi trening
  async obrisiTrening(id: string) {
    await remove(ref(this.db, 'treninzi/' + id));
  }

  // Azuriraj trening
  async updateTrening(id: string, data: any) {
    await update(ref(this.db, 'treninzi/' + id), data);
  }

  // Nadji trening po id
  async getTreningById(id: string): Promise<any> {
    const snapshot = await get(ref(this.db, 'treninzi/' + id));
    return snapshot.exists() ? { ...snapshot.val(), id } : null;
  }

  // Proveri da li je klijent vec prijavljen na trening
  async jePrijavljen(klijentUid: string, treningId: string): Promise<boolean> {
    const snapshot = await get(ref(this.db, 'prijave'));
    if (!snapshot.exists()) return false;

    const data = snapshot.val();
    // Trazimo prijavu gde su klijentUid i treningId jednaki
    return Object.values(data).some(
      (p: any) => p.klijentUid === klijentUid && p.treningId === treningId
    );
  }

  // Prijavi klijenta na trening
  async prijaviNaTrening(klijentUid: string, treningId: string): Promise<void> {
    // Dodajemo prijavu
    await push(ref(this.db, 'prijave'), {
      klijentUid,
      treningId,
      datumPrijave: new Date().toISOString()
    });

    // Povecavamo broj prijavljenih
    const treningSnap = await get(ref(this.db, 'treninzi/' + treningId));
    if (treningSnap.exists()) {
      const trenutniBroj = treningSnap.val()['prijavljeni'] || 0;
      await update(ref(this.db, 'treninzi/' + treningId), {
        prijavljeni: trenutniBroj + 1
      });
    }
  }

  // Nadji termine klijenta
  async getTerminiKlijenta(klijentUid: string): Promise<any[]> {
    const snapshot = await get(ref(this.db, 'prijave'));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    // Filtriramo samo prijave ovog klijenta
    const prijave = Object.keys(data)
      .map(key => ({ ...data[key], prijavaId: key }))
      .filter(p => p.klijentUid === klijentUid);

    // Za svaku prijavu ucitavamo trening
    const terminiPromises = prijave.map(async p => {
      const treningSnap = await get(ref(this.db, 'treninzi/' + p.treningId));
      if (treningSnap.exists()) {
        return {
          ...treningSnap.val(),
          treningId: p.treningId,
          prijavaId: p.prijavaId
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
    // Brisemo prijavu
    await remove(ref(this.db, 'prijave/' + prijavaId));

    // Smanjujemo broj prijavljenih
    const treningSnap = await get(ref(this.db, 'treninzi/' + treningId));
    if (treningSnap.exists()) {
      const trenutniBroj = treningSnap.val()['prijavljeni'] || 0;
      await update(ref(this.db, 'treninzi/' + treningId), {
        prijavljeni: Math.max(0, trenutniBroj - 1)
      });
    }
  }

  // Nadji klijente prijavljene na trening
  async getKlijentiZaTrening(treningId: string): Promise<any[]> {
    const snapshot = await get(ref(this.db, 'prijave'));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const prijave = Object.values(data).filter(
      (p: any) => p.treningId === treningId
    );

    const klijentiPromises = prijave.map(async (p: any) => {
      const userSnap = await get(ref(this.db, 'users/' + p.klijentUid));
      return userSnap.exists() ? userSnap.val() : null;
    });

    return (await Promise.all(klijentiPromises)).filter(k => k !== null);
  }

  // Snimi prisustvo kada zaposleni skenira QR
  async snimiPrisustvo(klijentUid: string): Promise<string> {
    const sad = new Date();
    const minus15 = new Date(sad.getTime() - 15 * 60 * 1000).toISOString();
    const plus15 = new Date(sad.getTime() + 15 * 60 * 1000).toISOString();

    // Trazimo trening koji pocinje za +-15 min
    const treninziSnap = await get(ref(this.db, 'treninzi'));
    if (!treninziSnap.exists()) return 'nema_treninga';

    const treninziData = treninziSnap.val();
    const treninzi = Object.keys(treninziData)
      .map(key => ({ ...treninziData[key], id: key }))
      .filter(t => t.datum >= minus15 && t.datum <= plus15);

    if (treninzi.length === 0) return 'nema_treninga';

    const trening = treninzi[0];

    // Proveravamo da li je klijent prijavljen
    const prijavljen = await this.jePrijavljen(klijentUid, trening.id);
    if (!prijavljen) return 'nije_prijavljen';

    // Proveravamo da li je vec evidentiran
    const prisustvoSnap = await get(ref(this.db, 'prisustvo'));
    if (prisustvoSnap.exists()) {
      const prisustvoData = prisustvoSnap.val();
      const vecEvidentiran = Object.values(prisustvoData).some(
        (p: any) => p.klijentUid === klijentUid && p.treningId === trening.id
      );
      if (vecEvidentiran) return 'vec_evidentiran';
    }

    // Dohvatamo ime klijenta
    const userSnap = await get(ref(this.db, 'users/' + klijentUid));
    const ime = userSnap.exists() ? userSnap.val()['name'] : 'Nepoznat';

    // Snimamo prisustvo
    await push(ref(this.db, 'prisustvo'), {
      klijentUid,
      ime,
      treningId: trening.id,
      treningNaziv: trening.naziv,
      datum: new Date().toISOString()
    });

    return 'ok';
  }

  // Nadji sva prisustva sortirana po datumu
  async getPrisustva(): Promise<any[]> {
    const snapshot = await get(ref(this.db, 'prisustvo'));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.keys(data)
      .map(key => ({ ...data[key], id: key }))
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
  }

  // Nadji sve prijave
  async getPrijave(): Promise<any[]> {
    const snapshot = await get(ref(this.db, 'prijave'));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.keys(data).map(key => ({ ...data[key], id: key }));
  }
}