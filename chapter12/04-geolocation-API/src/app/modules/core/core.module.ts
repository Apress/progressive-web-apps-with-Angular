import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SnackBarService } from './snack-bar.service';
import { AddToHomeScreenService } from './add-to-home-screen.service';
import { GeolocationService } from './geolocation.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthService,
    DataService,
    SnackBarService,
    AddToHomeScreenService,
    GeolocationService
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import Core modules in the AppModule only.`
      );
    }
  }
}
