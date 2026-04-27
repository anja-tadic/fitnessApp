import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreningInfoPage } from './trening-info.page';

describe('TreningInfoPage', () => {
  let component: TreningInfoPage;
  let fixture: ComponentFixture<TreningInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreningInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
