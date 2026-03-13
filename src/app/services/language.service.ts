import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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
  private apiUrl = 'http://localhost:8083/api/languages';
  private currentLanguageSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedLanguage') || 'en'
  );
  
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiUrl);
  }

  setLanguage(code: string): void {
    localStorage.setItem('selectedLanguage', code);
    this.currentLanguageSubject.next(code);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}
