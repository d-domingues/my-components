import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { TimeInputComponent } from './time-input.component';

@NgModule({
    imports: [CommonModule, MatInputModule],
    declarations: [TimeInputComponent],
    exports: [TimeInputComponent],
})
export class TimeInputModule {}
