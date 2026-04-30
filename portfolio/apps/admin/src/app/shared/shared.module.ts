import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConfirmDialogComponent, MaterialModule],
})
export class SharedModule {}
