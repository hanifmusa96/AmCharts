import { Component, Inject, NgZone, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import * as resource from '../../../assets/malaysiatry.json';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.scss'],
})
export class Map2Component implements OnInit {
  private chart: any = am4charts.XYChart;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  ngOnInit(): void {}

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // this.chart1();
    this.map2();
  }
  map2 = () => {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create('chartdiv5', am4maps.MapChart);
    console.log(chart);

    // Set map definition
    chart.geodata = resource;
    // chart.geodataSource.url = '../../assets/malaysiatry.json';
    // console.log(chart.geodataSource.url)
    // var defaultMap = 'usaAlbersLow';
    // var currentMap = defaultMap;
    // chart.geodataSource.url =
    //   'https://www.amcharts.com/lib/4/geodata/json/' + currentMap + '.json';
    // console.log(chart.geodataSource.url);
    // chart.geodataSource.events.on('parseended', function (ev) {
    //   var data = [];
    //   for (var i = 0; i < ev.target.data.features.length; i++) {
    //     data.push({
    //       id: ev.target.data.features[i].id,
    //       value: Math.round(Math.random() * 10000),
    //     });
    //   }
    //   polygonSeries.data = data;
    //   console.log(data);
    // });
    chart.reverseGeodata = true;

    // Set projection
    // chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
      property: 'fill',
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3),
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Set heatmap values for each state
    // polygonSeries.data =

    // Set up heat legend
    // let heatLegend = chart.createChild(am4maps.HeatLegend);
    // heatLegend.series = polygonSeries;
    // heatLegend.align = 'right';
    // heatLegend.valign = 'bottom';
    // heatLegend.width = am4core.percent(20);
    // heatLegend.marginRight = am4core.percent(4);
    // heatLegend.minValue = 0;
    // heatLegend.maxValue = 40000000;

    // Set up custom heat map legend labels using axis ranges
    // let minRange = heatLegend.valueAxis.axisRanges.create();
    // minRange.value = heatLegend.minValue;
    // minRange.label.text = 'Little';
    // let maxRange = heatLegend.valueAxis.axisRanges.create();
    // maxRange.value = heatLegend.maxValue;
    // maxRange.label.text = 'A lot!';

    // Blank out internal heat legend value axis labels
    // heatLegend.valueAxis.renderer.labels.template.adapter.add(
    //   'text',
    //   function (labelText) {
    //     return '';
    //   }
    // );

    // Configure series tooltip
    let polygonTemplate = polygonSeries.mapPolygons.template;
    console.log(polygonTemplate);
    polygonTemplate.tooltipText = 'State: {NAME_1}\nDistrict: {id}';
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#3c5bdc');
  };
}
