import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs/Observable';
import {
  from
} from 'rxjs/observable/from';
import { of
} from 'rxjs/observable/of';

import {
  ProductsUrlsService
} from './products-urls.service';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';
import {
  formatDate
} from '../../../app-utils/app-date-utils';

@Injectable()
export class ProductsService {

  constructor(private urls: ProductsUrlsService, private http: HttpClient) {}

  getProductsInfo(daylyDate: Date, fromDate: Date, toDate: Date): Observable < ProductInfo[] > {
    return this.getProductsLeftovers(fromDate)
      .map(restOvers => new Map(restOvers.map(x => [x.productTypeId, x] as[number, ProductLeftoverResponse])))
      .flatMap(restOversMap => this.getDaylyBatches(daylyDate)
        .map(dayBatches => new Map(dayBatches.map(x => [x.productTypeId, x] as[number, ProductBatchResponse])))
        .flatMap(dayBatchesMap => this.getMonthlyBatches(fromDate, toDate)
          .map(monthBatches => new Map(monthBatches.map(x => [x.productTypeId, x] as[number, ProductBatchResponse])))
          .flatMap(monthBatchesMap => this.getProductsLeftovers(toDate)
            .map(currentOvers => new Map(currentOvers.map(x => [x.productTypeId, x] as[number, ProductLeftoverResponse])))
            .flatMap(currentOversMap => this.getProductsChecks()
              .map(checks => new Map(checks.map(x => [x.productTypeId, x] as[number, ProductCheckResponse])))
              .flatMap(checksMap => this.getProductTypes()
                .flatMap(types => from(types)
                  .map(type => {
                    const info: ProductInfo = {
                      type,
                      restLeftover: restOversMap.get(type.id) || < ProductLeftoverResponse > {},
                      dayBatch: dayBatchesMap.get(type.id) || < ProductBatchResponse > {},
                      monthBatch: monthBatchesMap.get(type.id) || < ProductBatchResponse > {},
                      currentLeftover: currentOversMap.get(type.id) || < ProductLeftoverResponse > {},
                      productCheck: checksMap.get(type.id) || < ProductCheckResponse > {}
                    }
                    return info;
                  })
                )
              )
            )
          )
        )
      ).toArray();
  }

  getProductTypes(): Observable < ProductTypeResponse[] > {
    return this.http.get(this.urls.productTypesUrl).catch(httpErrorHandle);
  }

  getProductsLeftovers(date: Date): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
      .set('date', formatDate(date));
    return this.http.get(this.urls.productLeftoverUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getProductLeftover(productTypeId: number, date: Date): Observable < ProductLeftoverResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productLeftoverUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getDaylyBatches(date: Date): Observable < ProductBatchResponse[] > {
    const params = new HttpParams()
      .set('date', formatDate(date));
    return of([]);
  }

  getDaylyBatch(productTypeId: number, date: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productBatchUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getMonthlyBatches(fromDate: Date, toDate: Date): Observable < ProductBatchResponse[] > {
    const params = new HttpParams()
      .set('from', formatDate(fromDate))
      .set('to', formatDate(toDate));
    return of([]);
  }

  getMonthlyBatch(productTypeId: number, fromDate: Date, toDate: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('from', formatDate(fromDate))
      .set('to', formatDate(toDate));
    return this.http.get(this.urls.productBatchUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getProductsChecks(): Observable < ProductCheckResponse[] > {
    return this.http.get(this.urls.productChecksUrl).catch(httpErrorHandle);
  }

  getProductCheck(productTypeId: number): Observable < ProductCheckResponse > {
    const params = new HttpParams()
      .set('product_type_id', String(productTypeId));
    return this.http.get(this.urls.productChecksUrl, {
      params
    }).catch(httpErrorHandle);
  }

  postProductType(type: ProductTypeRequest): Observable < ProductTypeResponse > {
    return this.http.post(this.urls.productTypesUrl, type).catch(httpErrorHandle);
  }

  postProductOperation(operation: ProductOperationRequest): Observable < ProductOperationResponse > {
    return this.http.post(this.urls.productOperationUrl, operation).catch(httpErrorHandle);
  }

  putProductType(id: number, type: ProductTypeRequest): Observable < ProductTypeResponse > {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.put(url, type).catch(httpErrorHandle);
  }

  putProductCheck(id: number, check: ProductCheckRequest) {
    const url = `${this.urls.productChecksUrl}/${id}`;
    return this.http.put(url, check).catch(httpErrorHandle);
  }

  deleteProductType(id: number) {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.delete(url).catch(httpErrorHandle);
  }
}
