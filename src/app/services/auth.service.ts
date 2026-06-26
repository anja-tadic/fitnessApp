import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  role: string;
  name: string;
  gender: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user?: User | null;

  private _isUserAuthenticated = false;

  http: HttpClient = inject(HttpClient);

  // Bazni URL Realtime Database-a
  private dbUrl = environment.firebase.databaseURL;

  constructor() {}

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  getToken() {
    return this.user ? this.user.token : null;
  }

  getUserId() {
    return this.user ? this.user.id : null;
  }

  // Registracija — kreira nalog preko Auth REST API-ja i cuva podatke u bazi
  register(data: RegisterData): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
        { email: data.email, password: data.password, returnSecureToken: true },
      )
      .pipe(
        switchMap((authData) => {
          this._isUserAuthenticated = true;

          const noviKorisnik = {
            uid: authData.localId,
            email: data.email,
            name: data.name,
            role: data.role,
            gender: data.gender,
            phone: data.phone,
          };

          // Nakon registracije token se cuva pa ga koristimo odmah
          const expirationTime = new Date(
            new Date().getTime() + +authData.expiresIn * 1000,
          );
          this.user = new User(
            authData.localId,
            authData.email,
            authData.idToken,
            expirationTime,
          );

          // PUT cuva korisnika u bazi sa tokenom
          return this.http
            .put(
              `${this.dbUrl}/users/${authData.localId}.json?auth=${authData.idToken}`,
              noviKorisnik,
            )
            .pipe(map(() => authData));
        }),
      );
  }

  // Prijava korisnika preko Auth REST API-ja
  login(data: LoginData): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
        { email: data.email, password: data.password, returnSecureToken: true },
      )
      .pipe(
        tap((userData) => {
          this._isUserAuthenticated = true;
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000,
          );
          this.user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime,
          );
        }),
      );
  }

  // Odjava korisnika
  logout(): void {
    this._isUserAuthenticated = false;
    this.user = null;
  }

  // Nadji ulogu korisnika po uid
  getUserRole(uid: string): Observable<string> {
    return this.http
      .get<any>(`${this.dbUrl}/users/${uid}.json?auth=${this.getToken()}`)
      .pipe(map((data) => (data ? data.role : '')));
  }

  // Nadji jednog korisnika po uid
  getUserById(uid: string): Observable<any> {
    return this.http.get<any>(
      `${this.dbUrl}/users/${uid}.json?auth=${this.getToken()}`,
    );
  }

  // Nadji sve korisnike
  getKorisnici(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/users.json?auth=${this.getToken()}`,
      )
      .pipe(
        map((data) =>
          data
            ? Object.keys(data).map((key) => ({ ...data[key], uid: key }))
            : [],
        ),
      );
  }

  // Nadji sve klijente
  getKlijenti(): Observable<any[]> {
    return this.getKorisnici().pipe(
      map((lista) => lista.filter((u) => u.role === 'klijent')),
    );
  }

  // Nadji sve trenere (zaposlene)
  getTreneri(): Observable<any[]> {
    return this.getKorisnici().pipe(
      map((lista) => lista.filter((u) => u.role === 'zaposleni')),
    );
  }

  // Azuriranje korisnika — PATCH menja samo poslata polja
  updateUser(uid: string, data: any): Observable<any> {
    return this.http.patch(
      `${this.dbUrl}/users/${uid}.json?auth=${this.getToken()}`,
      data,
    );
  }

  // Brisanje korisnika
  deleteUser(uid: string): Observable<any> {
    return this.http.delete(
      `${this.dbUrl}/users/${uid}.json?auth=${this.getToken()}`,
    );
  }

  // Nadji sve treninge
  getTreninzi(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/treninzi.json?auth=${this.getToken()}`,
      )
      .pipe(
        map((data) =>
          data
            ? Object.keys(data)
                .map((key) => ({ ...data[key], id: key }))
                .sort(
                  (a, b) =>
                    new Date(a.datum).getTime() - new Date(b.datum).getTime(),
                )
            : [],
        ),
      );
  }

  // Nadji treninge za odredjenog trenera
  getTreninziZaTrenera(trenerUid: string): Observable<any[]> {
    return this.getTreninzi().pipe(
      map((lista) => lista.filter((t) => t.trenerUid === trenerUid)),
    );
  }

  // Dodaj trening — POST generise automatski id
  dodajTrening(trening: any): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(
      `${this.dbUrl}/treninzi.json?auth=${this.getToken()}`,
      trening,
    );
  }

  // Obrisi trening
  obrisiTrening(id: string): Observable<any> {
    return this.http.delete(
      `${this.dbUrl}/treninzi/${id}.json?auth=${this.getToken()}`,
    );
  }

  // Azuriraj trening
  updateTrening(id: string, data: any): Observable<any> {
    return this.http.patch(
      `${this.dbUrl}/treninzi/${id}.json?auth=${this.getToken()}`,
      data,
    );
  }

  // Nadji trening po id
  getTreningById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.dbUrl}/treninzi/${id}.json?auth=${this.getToken()}`)
      .pipe(map((data) => (data ? { ...data, id } : null)));
  }

  // Proveri da li je klijent vec prijavljen na trening
  jePrijavljen(klijentUid: string, treningId: string): Observable<boolean> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/prijave.json?auth=${this.getToken()}`,
      )
      .pipe(
        map((data) =>
          data
            ? Object.values(data).some(
                (p: any) =>
                  p.klijentUid === klijentUid && p.treningId === treningId,
              )
            : false,
        ),
      );
  }

  // Prijavi klijenta na trening
  prijaviNaTrening(klijentUid: string, treningId: string): Observable<any> {
    const novaPrijava = {
      klijentUid,
      treningId,
      datumPrijave: new Date().toISOString(),
    };

    return this.http
      .post(
        `${this.dbUrl}/prijave.json?auth=${this.getToken()}`,
        novaPrijava,
      )
      .pipe(
        switchMap(() =>
          this.getTreningById(treningId).pipe(
            switchMap((trening) => {
              const trenutniBroj = trening?.prijavljeni || 0;
              return this.http.patch(
                `${this.dbUrl}/treninzi/${treningId}.json?auth=${this.getToken()}`,
                { prijavljeni: trenutniBroj + 1 },
              );
            }),
          ),
        ),
      );
  }

  // Nadji termine klijenta
  getTerminiKlijenta(klijentUid: string): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/prijave.json?auth=${this.getToken()}`,
      )
      .pipe(
        switchMap((data) => {
          if (!data) return of([]);

          const prijave = Object.keys(data)
            .map((key) => ({ ...data[key], prijavaId: key }))
            .filter((p) => p.klijentUid === klijentUid);

          if (prijave.length === 0) return of([]);

          const treninziObservables = prijave.map((p) =>
            this.getTreningById(p.treningId).pipe(
              map((trening) =>
                trening
                  ? { ...trening, treningId: p.treningId, prijavaId: p.prijavaId }
                  : null,
              ),
            ),
          );

          return forkJoin(treninziObservables).pipe(
            map((svi) =>
              svi
                .filter((t) => t !== null)
                .sort(
                  (a: any, b: any) =>
                    new Date(a.datum).getTime() - new Date(b.datum).getTime(),
                ),
            ),
          );
        }),
      );
  }

  // Otkazi termin
  otkaziTermin(prijavaId: string, treningId: string): Observable<any> {
    return this.http
      .delete(`${this.dbUrl}/prijave/${prijavaId}.json?auth=${this.getToken()}`)
      .pipe(
        switchMap(() =>
          this.getTreningById(treningId).pipe(
            switchMap((trening) => {
              const trenutniBroj = trening?.prijavljeni || 0;
              return this.http.patch(
                `${this.dbUrl}/treninzi/${treningId}.json?auth=${this.getToken()}`,
                { prijavljeni: Math.max(0, trenutniBroj - 1) },
              );
            }),
          ),
        ),
      );
  }

  // Nadji klijente prijavljene na trening
  getKlijentiZaTrening(treningId: string): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/prijave.json?auth=${this.getToken()}`,
      )
      .pipe(
        switchMap((data) => {
          if (!data) return of([]);

          const prijave = Object.values(data).filter(
            (p: any) => p.treningId === treningId,
          );
          if (prijave.length === 0) return of([]);

          const korisniciObservables = prijave.map((p: any) =>
            this.getUserById(p.klijentUid),
          );

          return forkJoin(korisniciObservables).pipe(
            map((lista) => lista.filter((k) => k !== null)),
          );
        }),
      );
  }

  // Snimi prisustvo kada zaposleni skenira QR
  snimiPrisustvo(klijentUid: string): Observable<string> {
    const sad = new Date();
    const minus15 = new Date(sad.getTime() - 15 * 60 * 1000).toISOString();
    const plus15 = new Date(sad.getTime() + 15 * 60 * 1000).toISOString();

    return this.getTreninzi().pipe(
      switchMap((treninzi) => {
        const odgovarajuci = treninzi.filter(
          (t) => t.datum >= minus15 && t.datum <= plus15,
        );
        if (odgovarajuci.length === 0) return of('nema_treninga');

        const trening = odgovarajuci[0];

        return this.jePrijavljen(klijentUid, trening.id).pipe(
          switchMap((prijavljen) => {
            if (!prijavljen) return of('nije_prijavljen');

            return this.http
              .get<{ [key: string]: any }>(
                `${this.dbUrl}/prisustvo.json?auth=${this.getToken()}`,
              )
              .pipe(
                switchMap((prisustvoData) => {
                  if (prisustvoData) {
                    const vecEvidentiran = Object.values(prisustvoData).some(
                      (p: any) =>
                        p.klijentUid === klijentUid &&
                        p.treningId === trening.id,
                    );
                    if (vecEvidentiran) return of('vec_evidentiran');
                  }

                  return this.getUserById(klijentUid).pipe(
                    switchMap((korisnik) => {
                      const ime = korisnik ? korisnik.name : 'Nepoznat';

                      const novoPrisustvo = {
                        klijentUid,
                        ime,
                        treningId: trening.id,
                        treningNaziv: trening.naziv,
                        datum: new Date().toISOString(),
                      };

                      return this.http
                        .post(
                          `${this.dbUrl}/prisustvo.json?auth=${this.getToken()}`,
                          novoPrisustvo,
                        )
                        .pipe(map(() => 'ok'));
                    }),
                  );
                }),
              );
          }),
        );
      }),
    );
  }

  // Nadji sva prisustva sortirana po datumu
  getPrisustva(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/prisustvo.json?auth=${this.getToken()}`,
      )
      .pipe(
        map((data) =>
          data
            ? Object.keys(data)
                .map((key) => ({ ...data[key], id: key }))
                .sort(
                  (a, b) =>
                    new Date(b.datum).getTime() - new Date(a.datum).getTime(),
                )
            : [],
        ),
      );
  }

  // Nadji sve prijave
  getPrijave(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any }>(
        `${this.dbUrl}/prijave.json?auth=${this.getToken()}`,
      )
      .pipe(
        map((data) =>
          data
            ? Object.keys(data).map((key) => ({ ...data[key], id: key }))
            : [],
        ),
      );
  }
}