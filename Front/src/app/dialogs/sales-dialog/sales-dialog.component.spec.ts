import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaDialogComponent } from './sales-dialog.component';

describe('ArticleDialogComponent', () => {
  let component: VentaDialogComponent;
  let fixture: ComponentFixture<VentaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
