import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    private count = 0;

    constructor (private spinner: NgxSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.count++;
        if (this.count === 1) {
            this.spinner.show();
        }

        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.count--;
                    if (this.count === 0) {
                        this.spinner.hide();
                    }
                }
            }),
            catchError(error => {
                this.count--;
                return Observable.throw(error);
            })
        );
    }
}

export const ApiInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
};
