import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreningDetaljiPage } from './trening-detalji.page';

describe('TreningDetaljiPage', () => {
  let component: TreningDetaljiPage;
  let fixture: ComponentFixture<TreningDetaljiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreningDetaljiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
