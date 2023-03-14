import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  nearestPinMessage = null;
  queryFormControl = new FormControl('', [Validators.minLength(3)]);
  status = null;
}
