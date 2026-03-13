import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const notifications = JSON.parse(stored);
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
    }
  }

  addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    const current = this.notificationsSubject.value;
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    this.saveNotifications(updated);
    this.updateUnreadCount();
  }

  markAsRead(id: string) {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.saveNotifications(notifications);
    this.updateUnreadCount();
  }

  markAllAsRead() {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    this.saveNotifications(notifications);
    this.updateUnreadCount();
  }

  deleteNotification(id: string) {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
    this.saveNotifications(notifications);
    this.updateUnreadCount();
  }

  clearAll() {
    this.notificationsSubject.next([]);
    localStorage.removeItem('notifications');
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unread = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unread);
  }

  private saveNotifications(notifications: Notification[]) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }
}
