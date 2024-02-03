import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { delay, map } from 'rxjs/operators';
import { BaseFormControlComponent } from '../base-form-control.component';

@Component({
    selector: 'cc-time-input',
    template: `
        <input matInput #mi="matInput" [value]="value" (input)="onInput(mi)" />
        <button *ngIf="!(isFocused$ | async)" class="icon" (click)="mi.focus()">time</button>
        <button *ngIf="(isFocused$ | async) && value" class="icon" (click)="value = ''">error</button>
    `,
    styleUrls: ['time-input.component.scss'],
})
export class TimeInputComponent extends BaseFormControlComponent<string> {
    regex = /^$|^[0-2]$|^[01]\d$|^2[0-3]$|^([01]\d|2[0-3]):$|^([01]\d|2[0-3]):[0-5]$|^([01]\d|2[0-3]):[0-5]\d$/;

    isFocused$ = this.fm.monitor(this.elRef, true).pipe(
        delay(0),
        map((fOrigin) => !!fOrigin),
    );

    constructor(private elRef: ElementRef, private fm: FocusMonitor) {
        super();
        this.value = '';
    }

    onInput(matInput: MatInput) {
        let newValue = matInput.value;

        // insertion
        if (newValue.length > this.value.length) {
            if (/^[3-9]$/.test(newValue)) {
                newValue = `0${newValue}:`;
            } else if (/^[01]\d$|^2[0-3]$/.test(newValue)) {
                newValue = `${newValue}:`;
            } else if (/^\d\d:([6-9])$/.test(newValue)) {
                newValue = newValue.replace(/^(\d\d:)([6-9])$/, '$10$2');
            }
        }
        // deletion
        else {
            if (/^\d\d$/.test(newValue)) {
                newValue = newValue.replace(/^(\d)\d$/, '$1');
            }
        }

        // updates the components value if passes regex
        if (this.regex.test(newValue)) {
            this.value = newValue;
        }

        // updates the value in template
        matInput.value = this.value;
    }
}
