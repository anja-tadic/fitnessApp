import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrenerDetaljiPage } from './trener-detalji.page';

describe('TrenerDetaljiPage', () => {
  let component: TrenerDetaljiPage;
  let fixture: ComponentFixture<TrenerDetaljiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrenerDetaljiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
