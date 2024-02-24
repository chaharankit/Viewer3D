import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainviewerscreenComponent } from './mainviewerscreen.component';

describe('MainviewerscreenComponent', () => {
  let component: MainviewerscreenComponent;
  let fixture: ComponentFixture<MainviewerscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainviewerscreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainviewerscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
