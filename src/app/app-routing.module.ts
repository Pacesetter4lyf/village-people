import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PersonalModule } from './main/personal/personal.module';
import { LineageModule } from './main/lineage/lineage.module';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'individual',
    loadChildren: () =>
      import('./main/personal/personal.module').then(
        (m: { PersonalModule: typeof PersonalModule }) => m.PersonalModule
      ),
  },
  {
    path: 'lineage',
    loadChildren: () =>
      import('./main/lineage/lineage.module').then(
        (m: { LineageModule: typeof LineageModule }) => m.LineageModule
      ),
  },
  { path: '**', component: LandingComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
