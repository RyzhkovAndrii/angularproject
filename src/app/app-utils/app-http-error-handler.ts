import {
  HttpErrorResponse
} from "@angular/common/http";
import {
  ErrorObservable
} from "rxjs/observable/ErrorObservable";

export function httpErrorHandle(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    return new ErrorObservable([`Клиетская ошибка или ошибка сети, обновите страницу и попробуйте снова, если ошибка повторится, обратитесь к системному администратору: ${error.error.message}`]);
  } else if (error.status === 0) {
    return new ErrorObservable(['Нет связи с сервером, обратитесь к системному администратору']);
  } else if (error.status >= 400 && error.status < 500) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong
    return new ErrorObservable([
      `Код ошибки: ${error.status}`, 
      error.error.message
    ]);
  } else if (error.status >= 500) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong
    return new ErrorObservable([
      `Код ошибки: ${error.status}`,
      'Серверная ошибка, обратитесь к системному администратору',
      error.error.message
    ]);
  }
}
