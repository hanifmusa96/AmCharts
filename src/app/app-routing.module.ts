import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Chart1Component } from './charts/chart1/chart1.component';
import { Chart2Component } from './charts/chart2/chart2.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Map1Component } from './charts/map1/map1.component';
import { Map2Component } from './charts/map2/map2.component';
import { Chart4Component } from './charts/chart4/chart4.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'chart1',
    component: Chart1Component,
  },
  {
    path: 'chart2',
    component: Chart2Component,
  },
  {
    path: 'chart3',
    component: Chart3Component,
  },
  {
    path: 'map1',
    component: Map1Component,
  },
  {
    path: 'map2',
    component: Map2Component,
  },
  {
    path: 'chart4',
    component: Chart4Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
