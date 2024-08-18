import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarVisibilityService {
  private visibility = new BehaviorSubject<boolean>(true);
  visibility$ = this.visibility.asObservable();

  show() {
    this.visibility.next(true);
  }

  hide() {
    this.visibility.next(false);
  }
}
