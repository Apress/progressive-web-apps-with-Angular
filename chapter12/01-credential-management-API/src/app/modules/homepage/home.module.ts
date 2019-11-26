import { NgModule } from '@angular/core';
import { HomePageComponent } from './homepage.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [HomeRoutingModule],
  declarations: [HomePageComponent]
})
export class HomePageModule {}
