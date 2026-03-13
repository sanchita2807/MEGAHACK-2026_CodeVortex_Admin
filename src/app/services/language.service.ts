import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languages: Language[] = [
    { id: 1, code: 'en', name: 'English', nativeName: 'English', active: true },
    { id: 2, code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', active: true },
    { id: 3, code: 'mr', name: 'Marathi', nativeName: 'मराठी', active: true },
    { id: 4, code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', active: true }
  ];

  private currentLanguageSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedLanguage') || 'en'
  );
  
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {}

  getLanguages(): Observable<Language[]> {
    return of(this.languages);
  }

  setLanguage(code: string): void {
    localStorage.setItem('selectedLanguage', code);
    this.currentLanguageSubject.next(code);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}
