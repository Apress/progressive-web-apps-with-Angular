import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserContainerComponent } from './user-container.component';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    UserContainerComponent
  ]
})
export class UserModule { }
