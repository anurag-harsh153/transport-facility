import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { TransportPageComponent } from './transport-page/transport-page.component';

const routes: Routes = [
  {
    path: '',
    component: TransportPageComponent,
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
