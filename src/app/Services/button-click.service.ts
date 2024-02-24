import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonClickService {

  private buttonClickSubject = new Subject<{message:string,origin:string}>();
  constructor() { }
  buttonClick$=this.buttonClickSubject.asObservable();
  notifyButtonClick(message:string,origin:string){
    this.buttonClickSubject.next({message,origin});
  }
  
}
