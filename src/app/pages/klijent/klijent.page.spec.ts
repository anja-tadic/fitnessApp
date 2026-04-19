import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlijentPage } from './klijent.page';

describe('KlijentPage', () => {
  let component: KlijentPage;
  let fixture: ComponentFixture<KlijentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KlijentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
