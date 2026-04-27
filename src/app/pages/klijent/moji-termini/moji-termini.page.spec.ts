import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojiTerminiPage } from './moji-termini.page';

describe('MojiTerminiPage', () => {
  let component: MojiTerminiPage;
  let fixture: ComponentFixture<MojiTerminiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MojiTerminiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
