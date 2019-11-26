import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomePageComponent } from './homepage.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
