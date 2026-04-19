import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZaposleniPage } from './zaposleni.page';

describe('ZaposleniPage', () => {
  let component: ZaposleniPage;
  let fixture: ComponentFixture<ZaposleniPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaposleniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
