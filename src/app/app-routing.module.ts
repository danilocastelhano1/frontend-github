import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GithubComponent} from './components/github/github.component';

const routes: Routes = [
  { path: '', component: GithubComponent, pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
