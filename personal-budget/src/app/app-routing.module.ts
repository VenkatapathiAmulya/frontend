import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './_helpers';
 const dashboardsModule = () => import('./dashboards/dashboards.module').then(x => x.DashboardsModule);
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch : 'full'
  },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: 'dashboards', loadChildren: dashboardsModule},
  {
    path: '**',
    component: P404Component
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





