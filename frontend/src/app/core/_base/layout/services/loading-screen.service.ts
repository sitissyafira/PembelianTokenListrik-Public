import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

 
  private _loading: boolean = false;
  private _message: string = 'Loading ...';
  loadingStatus: Subject<any> = new Subject();
  loadingMessage: Subject<any> = new Subject();

  //get data to convert type data
  get loading():boolean {
    return this._loading;
  }
  get message():string {
    return this._message;
  }

  //set data subject from subscribe
  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }
  set message(value) {
    this._message = value;
    this.loadingMessage.next(value);
  }

  //function
  startLoading(value) {
    this.loading = true;
    this.message = value || this._message;
  }

  stopLoading() {
    this.loading = false;
    this.message = 'Loading ...';
  }
}