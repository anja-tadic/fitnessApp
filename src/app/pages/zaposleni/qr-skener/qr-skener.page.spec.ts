import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrSkenerPage } from './qr-skener.page';

describe('QrSkenerPage', () => {
  let component: QrSkenerPage;
  let fixture: ComponentFixture<QrSkenerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrSkenerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
