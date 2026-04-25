import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KorisniciPage } from './korisnici.page';

describe('KorisniciPage', () => {
  let component: KorisniciPage;
  let fixture: ComponentFixture<KorisniciPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KorisniciPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
