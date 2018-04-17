import {
  Injectable
} from '@angular/core';
import {
  UrlService
} from './url.service';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  flatMap
} from 'rxjs/operators';
import {
  from
} from 'rxjs/observable/from';
import { of
} from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { formatDate } from '../app-utils/app-date-utils.module';

@Injectable()
export class RollsService {

  constructor(private urls: UrlService, private http: HttpClient) {}

  getRollsInfo(restDate: Date, totalDate: Date): Observable<RollInfo[]> {
    // return this.http.get(this.urls.rollTypesUrl).flatMap(
    //   (data: RollType[]) => from(data)
    //   .flatMap((type: RollType) => this.getRollBatchesByDateRange(type.id, restDate, totalDate)
    //     .flatMap((batches: RollBatch[]) => this.getRollLeftoverByRollIdAndDate(type.id, restDate)
    //       .flatMap((restOver: RollLeftover) => this.getRollLeftoverByRollIdAndDate(type.id, totalDate)
    //         .flatMap((totalOver: RollLeftover) => {
    //           const rollInfo: RollInfo = {
    //             rollType: type,
    //             rollBatches: batches,
    //             restRollLeftover: restOver,
    //             totalRollLeftover: totalOver,
    //           };
    //           return of(rollInfo);
    //         })
    //       )
    //     )
    //   )
    // ).toArray();
    return <Observable<RollInfo[]>> this.http.get('http://localhost:3000/rollsInfo');
  }

  getRollBatchesByDateRange(id: number, from: Date, to: Date) {
    const params = new HttpParams({
      fromObject: {
        id: String(id),
        from: formatDate(from),
        to: formatDate(to)
      }
    });
    return this.http.get(this.urls.rollBatchUrl, {
      params
    });
  }

  getRollLeftoverByRollIdAndDate(id: number, date: Date) {
    const params = new HttpParams({
      fromObject: {
        id: String(id),
        date: formatDate(date)
      }
    });
    return this.http.get(this.urls.rollLeftoverUrl, {
      params
    });
  }

}
