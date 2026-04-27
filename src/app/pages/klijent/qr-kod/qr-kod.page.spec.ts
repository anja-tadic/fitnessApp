import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrKodPage } from './qr-kod.page';

describe('QrKodPage', () => {
  let component: QrKodPage;
  let fixture: ComponentFixture<QrKodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrKodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
