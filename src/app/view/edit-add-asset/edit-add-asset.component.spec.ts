import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddAssetComponent } from './edit-add-asset.component';

describe('EditAddAssetComponent', () => {
  let component: EditAddAssetComponent;
  let fixture: ComponentFixture<EditAddAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAddAssetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAddAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
