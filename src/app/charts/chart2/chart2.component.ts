import { Component, Inject, NgZone, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_usaAlbersLow from '@amcharts/amcharts4-geodata/usaAlbersLow';

import * as resource from '../../../assets/data21.json';
import * as resource2 from '../../../assets/data22.json';

@Component({
  selector: 'app-chart2',
  templateUrl: './chart2.component.html',
  styleUrls: ['./chart2.component.scss'],
})
export class Chart2Component implements OnInit {
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
    this.chart2();
  }

  chart2 = () => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let mainContainer = am4core.create('chartdiv2', am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = 'horizontal';

    let usData = resource;

    let maleChart = mainContainer.createChild(am4charts.XYChart);
    maleChart.paddingRight = 0;
    maleChart.data = JSON.parse(JSON.stringify(usData));

    // Create axes
    let maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
    maleCategoryAxis.dataFields.category = 'age';
    maleCategoryAxis.renderer.grid.template.location = 0;
    // maleCategoryAxis.renderer.inversed = true;
    maleCategoryAxis.renderer.minGridDistance = 15;

    let maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
    maleValueAxis.renderer.inversed = true;
    maleValueAxis.min = 0;
    maleValueAxis.max = 10;
    maleValueAxis.strictMinMax = true;

    maleValueAxis.numberFormatter = new am4core.NumberFormatter();
    maleValueAxis.numberFormatter.numberFormat = "#.#'%'";

    // Create series
    let maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
    maleSeries.dataFields.valueX = 'male';
    maleSeries.dataFields.valueXShow = 'percent';
    maleSeries.calculatePercent = true;
    maleSeries.dataFields.categoryY = 'age';
    maleSeries.interpolationDuration = 1000;
    maleSeries.columns.template.tooltipText =
      "Males, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    maleSeries.sequencedInterpolation = true; //for animation

    //********************************************************************************************* */
    let femaleChart = mainContainer.createChild(am4charts.XYChart);
    femaleChart.paddingLeft = 0;
    femaleChart.data = JSON.parse(JSON.stringify(usData));

    // Create axes
    let femaleCategoryAxis = femaleChart.yAxes.push(
      new am4charts.CategoryAxis()
    );
    femaleCategoryAxis.renderer.opposite = true;
    femaleCategoryAxis.dataFields.category = 'age';
    femaleCategoryAxis.renderer.grid.template.location = 0;
    femaleCategoryAxis.renderer.minGridDistance = 15;

    let femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
    femaleValueAxis.min = 0;
    femaleValueAxis.max = 10;
    femaleValueAxis.strictMinMax = true;
    femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
    femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    femaleValueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
    femaleSeries.dataFields.valueX = 'female';
    femaleSeries.dataFields.valueXShow = 'percent';
    femaleSeries.calculatePercent = true;
    femaleSeries.fill = femaleChart.colors.getIndex(4);
    femaleSeries.stroke = femaleSeries.fill;
    //femaleSeries.sequencedInterpolation = true;
    femaleSeries.columns.template.tooltipText =
      "Females, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    femaleSeries.dataFields.categoryY = 'age';
    femaleSeries.interpolationDuration = 1000;

    let mapChart = mainContainer.createChild(am4maps.MapChart);
    mapChart.projection = new am4maps.projections.Mercator();
    mapChart.geodata = am4geodata_usaAlbersLow;
    mapChart.zoomControl = new am4maps.ZoomControl();
    mapChart.zIndex = -1;

    let polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    let selectedStateId = 'US';
    let selectedPolygon: any;
    let selectedStateName: any;

    let polygonTemplate: any = polygonSeries.mapPolygons.template;
    polygonTemplate.togglable = true;

    let hoverState = polygonTemplate.states.create('hover');
    hoverState.properties.fill = mapChart.colors.getIndex(2);

    let activeState = polygonTemplate.states.create('active');
    activeState.properties.fill = mapChart.colors.getIndex(6);

    polygonTemplate.events.on('hit', function (event: any) {
      let id: any = event.target.dataItem.dataContext.id;
      let stateId = id.split('-')[1];
      showState(stateId, event.target.dataItem.dataContext.name, event.target);
    });

    mapChart.seriesContainer.background.events.on('over', function (event) {
      showState(selectedStateId, selectedStateName, selectedPolygon);
    });

    function showState(id: any, stateName: any, polygon: any) {
      if (selectedStateId != id) {
        let newData = stateData[id];

        if (selectedPolygon) {
          selectedPolygon.isActive = false;
        }

        for (var i = 0; i < femaleChart.data.length; i++) {
          femaleChart.data[i].female = newData[i].female;
          maleChart.data[i].male = newData[i].male;
        }

        femaleChart.invalidateRawData();
        maleChart.invalidateRawData();

        selectedStateName = stateName;
        selectedStateId = id;
        selectedPolygon = polygon;

        label.text = stateName + ' population pyramid';
        label.hide(0);
        label.show();
      }
    }

    let label = mainContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.x = am4core.percent(80);
    label.horizontalCenter = 'middle';
    label.y = 50;
    label.showOnInit = true;
    label.text = 'US Population pyramid';
    label.hiddenState.properties.dy = -100;

    let stateData: any = resource2;
  };
}
