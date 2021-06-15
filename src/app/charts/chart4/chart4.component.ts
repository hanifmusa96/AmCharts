import { Component, Inject, NgZone, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// import { debug } from 'console';

declare var jQuery: any;

@Component({
  selector: 'app-chart4',
  templateUrl: './chart4.component.html',
  styleUrls: ['./chart4.component.scss'],
})
export class Chart4Component implements OnInit {
  private chart: any = am4charts.XYChart;
  // @Inject(DOCUMENT) document: any;

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
    this.chart4();
  }

  chart4 = () => {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart
    let chart: any = am4core.create('chartdiv', am4charts.XYChart);
    chart.padding(0, 15, 0, 15);

    // Load data
    chart.dataSource.url =
      'https://www.amcharts.com/wp-content/uploads/assets/stock/MSFT.csv';
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;
    chart.dataSource.parser.options.reverse = true;

    // the following line makes value axes to be arranged vertically.
    chart.leftAxesContainer.layout = 'vertical';

    // uncomment this line if you want to change order of axes
    // chart.bottomAxesContainer.reverseOrder = true;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.keepSelection = true;
    dateAxis.minHeight = 30;

    dateAxis.groupData = true;
    dateAxis.minZoomCount = 5;

    // these two lines makes the axis to be initially zoomed-in
    // dateAxis.start = 0.7;
    // dateAxis.keepSelection = true;

    //******************************************************************************************** */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.zIndex = 1;
    valueAxis.renderer.baseGrid.disabled = true;
    // height of axis
    valueAxis.height = am4core.percent(65);

    valueAxis.renderer.gridContainer.background.fill = am4core.color('#000000');
    valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);

    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.fontSize = '0.8em';

    let series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = 'Date';
    series.dataFields.openValueY = 'Open';
    series.dataFields.valueY = 'Close';
    series.dataFields.lowValueY = 'Low';
    series.dataFields.highValueY = 'High';
    series.clustered = false;
    series.tooltipText =
      'open: {openValueY.value}\nlow: {lowValueY.value}\nhigh: {highValueY.value}\nclose: {valueY.value}';
    series.name = 'MSFT';
    series.defaultState.transitionDuration = 0;

    ///**************************************************************************** */
    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    // height of axis
    valueAxis2.height = am4core.percent(35);
    valueAxis2.zIndex = 3;
    // this makes gap between panels
    valueAxis2.marginTop = 30;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis2.renderer.fontSize = '0.8em';

    valueAxis2.renderer.gridContainer.background.fill =
      am4core.color('#000000');
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.dateX = 'Date';
    series2.clustered = false;
    series2.dataFields.valueY = 'Volume';
    series2.yAxis = valueAxis2;
    series2.tooltipText = '{valueY.value}';
    series2.name = 'Series 2';
    // volume should be summed
    series2.groupFields.valueY = 'sum';
    series2.defaultState.transitionDuration = 0;

    chart.cursor = new am4charts.XYCursor(); //for hover and show value
    debugger;
    //************************************************************************************* */
    let scrollbarX: any = new am4charts.XYChartScrollbar();

    let sbSeries = chart.series.push(new am4charts.LineSeries());
    sbSeries.dataFields.valueY = 'Close';
    sbSeries.dataFields.dateX = 'Date';
    scrollbarX.series.push(sbSeries);
    sbSeries.disabled = true;
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;
    scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;

    /**
     * Set up external controls
     */

    // Date format to be used in input fields
    let inputFieldFormat = 'yyyy-MM-dd';

    jQuery('#b1m').on('click', function () {
      let max = dateAxis.groupMax['day1'];
      let date = new Date(max);
      am4core.time.add(date, 'month', -1);
      zoomToDates(date);
    });
    jQuery('#b3m').on('click', function () {
      let max = dateAxis.groupMax['day1'];
      let date = new Date(max);
      am4core.time.add(date, 'month', -3);
      zoomToDates(date);
    });
    jQuery('#b6m').on('click', function () {
      let max = dateAxis.groupMax['day1'];
      let date = new Date(max);
      am4core.time.add(date, 'month', -6);
      zoomToDates(date);
    });
    jQuery('#b1y').on('click', function () {
      let max = dateAxis.groupMax['day1'];
      let date = new Date(max);
      am4core.time.add(date, 'year', -1);
      zoomToDates(date);
    });

    jQuery('#bmax').on('click', function () {
      let min = dateAxis.groupMin['day1'];
      let date = new Date(min);
      zoomToDates(date);
    });

    // button1=()=>{
    //   let max = dateAxis.groupMax['day1'];
    //   let date = new Date(max);
    //   am4core.time.add(date, 'month', -3);
    //   zoomToDates(date);
    // })

    // document.getElementById('b6m').addEventListener('click', function () {
    //   let max = dateAxis.groupMax['day1'];
    //   let date = new Date(max);
    //   am4core.time.add(date, 'month', -6);
    //   zoomToDates(date);
    // });

    // document.getElementById('b1y').addEventListener('click', function () {
    //   let max = dateAxis.groupMax['day1'];
    //   let date = new Date(max);
    //   am4core.time.add(date, 'year', -1);
    //   zoomToDates(date);
    // });

    // document.getElementById('bytd').addEventListener('click', function () {
    //   let max = dateAxis.groupMax['day1'];
    //   let date = new Date(max);
    //   am4core.time.round(date, 'year', 1);
    //   zoomToDates(date);
    // });

    // document.getElementById('bmax').addEventListener('click', function () {
    //   let min = dateAxis.groupMin['day1'];
    //   let date = new Date(min);
    //   zoomToDates(date);
    // });

    // dateAxis.events.on('selectionextremeschanged', function () {
    //   updateFields();
    // });

    // dateAxis.events.on('extremeschanged', updateFields);

    // function updateFields() {
    //   let minZoomed =
    //     dateAxis.minZoomed +
    //     am4core.time.getDuration(
    //       dateAxis.mainBaseInterval.timeUnit,
    //       dateAxis.mainBaseInterval.count
    //     ) *
    //       0.5;
    //   jQuery('#fromfield').val = chart.dateFormatter.format(
    //     minZoomed,
    //     inputFieldFormat
    //   );
    //   jQuery('#tofield').val = chart.dateFormatter.format(
    //     new Date(dateAxis.maxZoomed),
    //     inputFieldFormat
    //   );
    // }
    // jQuery('#fromfield').keyup(updateZoom);
    // jQuery('#tofield').keyup(updateZoom);

    // document.getElementById('fromfield').addEventListener('keyup', updateZoom);
    // document.getElementById('tofield').addEventListener('keyup', updateZoom);

    let zoomTimeout: any;
    function updateZoom() {
      if (zoomTimeout) {
        clearTimeout(zoomTimeout);
      }
      zoomTimeout = setTimeout(function () {
        let start = jQuery('#fromfield').val();
        let end = jQuery('#tofield').val();
        if (
          start.length < inputFieldFormat.length ||
          end.length < inputFieldFormat.length
        ) {
          return;
        }
        let startDate = chart.dateFormatter.parse(start, inputFieldFormat);
        let endDate = chart.dateFormatter.parse(end, inputFieldFormat);

        if (startDate && endDate) {
          dateAxis.zoomToDates(startDate, endDate);
        }
      }, 500);
    }

    function zoomToDates(date: any) {
      let min = dateAxis.groupMin['day1'];
      let max = dateAxis.groupMax['day1'];
      dateAxis.keepSelection = true;
      dateAxis.start = (date.getTime() - min) / (max - min);
      dateAxis.end = 1;

      dateAxis.zoom({ start: (date.getTime() - min) / (max - min), end: 1 });
    }
  };
}
