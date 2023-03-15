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
  nearestPinMessage: string | null = null;
  queryFormControl = new FormControl('', [Validators.minLength(3)]);
  status: string | null = null;

  constructor(
    private locationFetcherService: LocationFetcherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToFormFieldChanges();
  }

  subscribeToFormFieldChanges() {
    this.queryFormControl.valueChanges
      .pipe(
        filter((_val) => {
          this.nearestPinMessage = null;
          this.status = null;
          this.cdr.markForCheck();
          if (this.queryFormControl.invalid) {
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
          console.log(val);
          this.status = 'Fetching nearest store';
          this.cdr.markForCheck();
          return this.locationFetcherService.getLocationForQuery(val);
        })
      )
      .subscribe((locationDetails) => {
        this.status = null;
        if (locationDetails.data.success) {
          if (locationDetails.data.coveredByPolygon) {
            if (locationDetails.data.deliverablePointInPolygon) {
              this.nearestPinMessage = `Your nearest outlet is <b>${locationDetails.data.deliverablePointInPolygon.properties.Name}</b> which falls inside the polygon with identifier <b>${locationDetails.data.coveringPolygon?.properties?.Name}</b>`;
            } else {
              this.nearestPinMessage =
                'Your location does fall in one of the pre-defined polygons but it does not have an outlet identifier';
            }
          } else {
            this.nearestPinMessage =
              'Your location did not fall in any of the pre-defined polygons';
          }
        } else {
          this.nearestPinMessage = `Your nearest outlet identifier cannot be determined. ${locationDetails.data.error}`;
        }
        this.cdr.markForCheck();
      });
  }
}
