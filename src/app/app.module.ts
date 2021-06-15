import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ShapeService } from './shape.service';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Chart1Component } from './charts/chart1/chart1.component';
import { Chart2Component } from './charts/chart2/chart2.component';
import { HeaderComponent } from './header/header.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Map1Component } from './charts/map1/map1.component';
import { Map2Component } from './charts/map2/map2.component';
import { Chart4Component } from './charts/chart4/chart4.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    Chart1Component,
    Chart2Component,
    HeaderComponent,
    Chart3Component,
    Map1Component,
    Map2Component,
    Chart4Component,
    LandingPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [ShapeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
