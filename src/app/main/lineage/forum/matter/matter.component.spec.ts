import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatterComponent } from './matter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatterComponent', () => {
  let component: MatterComponent;
  let fixture: ComponentFixture<MatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
