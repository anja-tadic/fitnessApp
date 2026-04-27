import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojiTreninziPage } from './moji-treninzi.page';

describe('MojiTreninziPage', () => {
  let component: MojiTreninziPage;
  let fixture: ComponentFixture<MojiTreninziPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MojiTreninziPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
