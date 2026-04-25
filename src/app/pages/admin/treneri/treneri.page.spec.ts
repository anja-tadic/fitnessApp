import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreneriPage } from './treneri.page';

describe('TreneriPage', () => {
  let component: TreneriPage;
  let fixture: ComponentFixture<TreneriPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreneriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
