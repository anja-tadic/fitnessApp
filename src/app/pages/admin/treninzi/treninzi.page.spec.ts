import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreninziPage } from './treninzi.page';

describe('TreninziPage', () => {
  let component: TreninziPage;
  let fixture: ComponentFixture<TreninziPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreninziPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
