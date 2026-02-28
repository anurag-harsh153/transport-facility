import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { TransportPageComponent } from './transport-page/transport-page.component';
import { authGuard } from '../../core/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: TransportPageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RideListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
