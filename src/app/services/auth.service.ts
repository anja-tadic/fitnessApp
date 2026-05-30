import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
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

    await setDoc(doc(this.firestore, 'users', user.uid), { //  U Firestore bazi kreira se dokumet sa ovim podacima
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
    const docRef = doc(this.firestore, 'users', uid); // trayi dok sa tim id
    const docSnap = await getDoc(docRef); // adresa dokumenta u firestore bazi
    if (docSnap.exists()) {
      return docSnap.data()['role'];
    }
    return null;
  }
}
