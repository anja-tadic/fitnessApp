import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registracija
  async register(email: string, password: string, role: string, name: string, gender: string, phone: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(this.firestore, 'users', user.uid), {
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
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Odjava
  async logout() {
    return signOut(this.auth);
  }

  // Dohvati ulogu korisnika
  async getUserRole(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['role'];
    }
    return null;
  }
}
