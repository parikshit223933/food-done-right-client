import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LocationFetcherService } from '../services/location-fetcher.service';
import { debounceTime, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  nearestPinMessage = null;
  queryFormControl = new FormControl('', [Validators.minLength(3)]);
  status: string | null = null;

  constructor(
    private locationFetcherService: LocationFetcherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.queryFormControl.valueChanges
      .pipe(
        filter((_val) => {
          console.log(_val);
          if (this.queryFormControl.invalid) {
            this.status = null;
            this.cdr.markForCheck();
          }
          return this.queryFormControl.valid;
        }),
        switchMap((value) => {
          this.status = 'Waiting for you to stop typing...';
          this.cdr.markForCheck();
          return of(value);
        }),
        debounceTime(1000)
      )
      .pipe(
        switchMap((val: string) => {
          this.status = 'Fetching nearest store';
          this.cdr.markForCheck();
          return this.locationFetcherService.getLocationForQuery(val);
        })
      )
      .subscribe((locationDetails) => {
        console.log(locationDetails.data);
        this.cdr.markForCheck();
      });
  }
}
