import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/core/auth.guard';
import { NoCacheRouteComponent } from './no-cache-route.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'notes',
    loadChildren: './modules/notes/notes.module#NotesModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'no-cache-route',
    component: NoCacheRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
