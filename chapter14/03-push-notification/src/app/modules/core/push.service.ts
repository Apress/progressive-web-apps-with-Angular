import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class SwPushService {
  constructor(@Inject(PLATFORM_ID) private platformId) {}

  public async checkSW(): Promise<{ isEnabled: boolean; subscription: any }> {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.serviceWorker) {
        const registration = await navigator.serviceWorker.getRegistration();
        let subscription;
        if ('PushManager' in window && registration) {
          subscription = await registration.pushManager.getSubscription();
        }
        return { isEnabled: true, subscription };
      } else {
        return { isEnabled: false, subscription: null };
      }
    } else {
      return { isEnabled: false, subscription: null };
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async requestSubscription({ serverPublicKey }) {
    if (isPlatformBrowser(this.platformId)) {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(serverPublicKey)
      });
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration.pushManager.getSubscription();
      console.log({ subscription });
      return subscription.unsubscribe();
    }
  }
}
