import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LocationResponseModel } from '../models/location-response.model';
import { BACKEND_BASE_URL, END_POINTS } from '../constants/routes.constants';

@Injectable({ providedIn: 'root' })
export class LocationFetcherService {
  getLocationForQuery(query: string): Observable<AxiosResponse<LocationResponseModel>> {
    return fromPromise(axios.get(BACKEND_BASE_URL + END_POINTS.FETCH_IDENTIFIER, {
      params: {
        query,
      },
    }));
  }
}
