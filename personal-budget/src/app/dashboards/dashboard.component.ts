import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
import { first } from 'rxjs/operators';
import * as d3 from 'd3';

import { AccountService } from '../_services';

@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private svg;
  private margin = 50;
  private width = 400;
  private height = 300;

  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  private data = [];
  public dataSource =  {
    datasets: [
        {
            data: [],
            backgroundColor:[],
            expenses:[],
        }
    ],
    labels:[]
};
usersbudgetdata = null;

constructor(public dataService: DataService,
  private accountService: AccountService
) { }

ngOnInit(): void {

  const username = localStorage.getItem('user');
  this.accountService.getAll(username)
  .pipe(first())
  .subscribe(res =>{ this.usersbudgetdata = res;
    console.log("*********************res",res);
    for ( var i = 0 ; i < res.length; i++) {
        this.dataSource.datasets[0].data[i] = res[i].budget;
        this.dataSource.labels[i] = res[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = res[i].color;
        this.dataSource.datasets[0].expenses[i]= res[i].expense;
        this.createChart();
        this.barchartfunction();

    }
    this.data= res;
    this.createSvg();
      this.createColors();
      this.drawChart();
  });

}

// onSubmitMonth() {
//   console.log("((((((");
// }

createChart() {
  var ctx = document.getElementById('myChart');
  var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
  });
}

deleteData(id: String) {
  const userbudgetdata = this.usersbudgetdata.find(x => x.id === id);
  userbudgetdata.isDeleting = true;
  this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => {this.usersbudgetdata = this.usersbudgetdata.filter(x => x.id !== id);
        window.location.reload();
      });
}


barchartfunction(){
  var densityData = {
    label: 'Budget',
    data: this.dataSource.datasets[0].data,
    backgroundColor: 'rgba(0, 55, 132, 0.6)',
    borderColor: 'rgba(0, 99, 132, 1)',
    yAxisID: "y-axis-density"
  };

  var gravityData = {
    label: 'Expense',
    data: this.dataSource.datasets[0].expenses,
    backgroundColor: 'rgba(99, 55, 0, 0.6)',
    borderColor: 'rgba(99, 132, 0, 1)',
    yAxisID: "y-axis-gravity"
  };

  var planetData = {
    //  labels: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    labels: this.dataSource.labels,
    datasets: [densityData, gravityData]
  };

  var chartOptions = {
    scales: {
      xAxes: [{
        barPercentage: 1,
        categoryPercentage: 0.6
      }],
      yAxes: [{
        id: "y-axis-density"
      }, {
        id: "y-axis-gravity"
      }]
    }
  };

  var densityCanvas = document.getElementById("bargraph")
  var barChart = new Chart(densityCanvas, {
    type: 'bar',
    data: planetData,
    options: chartOptions
  });
}


private createSvg(): void {
  this.svg = d3.select("figure#pie")
  .append("svg")
  .attr("width", this.width)
  .attr("height", this.height)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  );
}
private createColors(): void {
this.colors = d3.scaleOrdinal()
.domain(this.data.map(d => d.budget.toString()))
//.range(["#ffcd56", "#ff6384", "#36a2eb", "#fd6b19", "#fdfd19","#189c40","#04350c","#652e7a"]);
.range(this.data.map(d => d.color.toString()));
}
private drawChart(): void {
// Compute the position of each group on the pie:
const pie = d3.pie<any>().value((d: any) => Number(d.budget));

// Build the pie chart
this.svg
.selectAll('pieces')
.data(pie(this.data))
.enter()
.append('path')
.attr('d', d3.arc()
  .innerRadius(0)
  .outerRadius(this.radius)
)
.attr('fill', (d, i) => (this.colors(i)))
.attr("stroke", "#121926")
.style("stroke-width", "1px");

// Add labels
const labelLocation = d3.arc()
.innerRadius(100)
.outerRadius(this.radius);

this.svg
.selectAll('pieces')
.data(pie(this.data))
.enter()
.append('text')
.text(d => d.data.title)
.attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
.style("text-anchor", "middle")
.style("font-size", 15);
}


}
