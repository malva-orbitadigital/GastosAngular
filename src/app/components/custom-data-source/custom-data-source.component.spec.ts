import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataSourceComponent } from './custom-data-source.component';

describe('CustomDataSourceComponent', () => {
  let component: CustomDataSourceComponent;
  let fixture: ComponentFixture<CustomDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDataSourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
