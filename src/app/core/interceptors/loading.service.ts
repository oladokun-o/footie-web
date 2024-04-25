import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$:BehaviorSubject<any>=new BehaviorSubject(true)

  constructor() { }
}
