import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './modules/core/auth.guard';
import { LoadingComponent } from './loading.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full'
  },
  {
    path: 'loading',
    component: LoadingComponent
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'notes',
    loadChildren: './modules/notes/notes.module#NotesModule',
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
