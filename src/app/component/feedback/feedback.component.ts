import {Component, Input} from '@angular/core';

/**
 * Component for displaying messages with different designs.
 */
@Component({
  selector: 'app-feedback',
  template: `
    <div *ngIf="messageType !== ''"
         [ngClass]="{'alert': true,
         'alert-primary': messageType === 'primary',
         'alert-danger': messageType === 'danger',
         'alert-warning': messageType === 'warning',
         'alert-success': messageType === 'success'
         }">
      {{ message }}
    </div>
  `
})

export class FeedbackComponent {
  @Input() message: string | null = null;
  @Input() messageType: string = "";


  constructor() {
  }
}
