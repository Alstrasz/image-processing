import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canvas3dComponent } from './canvas3d.component';

describe('Canvas3dComponent', () => {
  let component: Canvas3dComponent;
  let fixture: ComponentFixture<Canvas3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Canvas3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Canvas3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
