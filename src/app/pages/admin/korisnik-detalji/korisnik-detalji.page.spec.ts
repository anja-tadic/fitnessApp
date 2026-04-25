import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KorisnikDetaljiPage } from './korisnik-detalji.page';

describe('KorisnikDetaljiPage', () => {
  let component: KorisnikDetaljiPage;
  let fixture: ComponentFixture<KorisnikDetaljiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KorisnikDetaljiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
