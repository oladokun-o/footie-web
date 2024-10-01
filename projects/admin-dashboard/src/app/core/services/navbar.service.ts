import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private readonly localStorageKey = 'navbarVisible';
  private isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    const storedVisibility = localStorage.getItem(this.localStorageKey);
    const isVisible = storedVisibility === 'true'; // Convert string back to boolean
    this.isVisibleSubject = new BehaviorSubject<boolean>(isVisible);
    this.updateDocumentBody();
  }

  isVisible$ = this.isVisibleSubject.asObservable();

  private updateLocalStorage(isVisible: boolean) {
    localStorage.setItem(this.localStorageKey, String(isVisible)); // Save the visibility state
  }

  showNavbar() {
    this.isVisibleSubject.next(true);
    this.updateLocalStorage(true);
    this.updateDocumentBody();
  }

  hideNavbar() {
    this.isVisibleSubject.next(false);
    this.updateLocalStorage(false);
    this.updateDocumentBody();
  }

  toggleNavbar() {
    const currentState = this.isVisibleSubject.value;
    const newState = !currentState;
    this.isVisibleSubject.next(newState);
    this.updateLocalStorage(newState);
    this.updateDocumentBody();
  }

  updateDocumentBody() {
    const isVisible = this.isVisibleSubject.value;
    if (!isVisible) {
      document.body.classList.add('mini-sidebar');
      document.querySelector('.main-wrapper')?.classList.remove('slide-nav');
      document.querySelector('.sidebar-overlay')?.classList.remove('opened');
    } else {
      document.body.classList.remove('mini-sidebar');
      document.querySelector('.main-wrapper')?.classList.add('slide-nav');
      document.querySelector('.sidebar-overlay')?.classList.add('opened');
    }
  }
}
