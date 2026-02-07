import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private pendingCount = 0;

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  show(): void {
    this.pendingCount += 1;
    if (this.pendingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.pendingCount === 0) {
      return;
    }

    this.pendingCount -= 1;
    if (this.pendingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  setLoading(isLoading: boolean): void {
    this.pendingCount = isLoading ? 1 : 0;
    this.loadingSubject.next(isLoading);
  }

  reset(): void {
    this.pendingCount = 0;
    this.loadingSubject.next(false);
  }
}
