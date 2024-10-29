import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private barChart!: Chart<'bar'>;
  private lineChart!: Chart<'line'>;
  private pieChart!: Chart<'pie'>;

  constructor() {
    // Registra todos los componentes necesarios de Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createCharts();
  }

  createCharts() {
    const inventoryData = [50, 30, 70, 45];
    const salesData = [65, 59, 80, 81, 56];
    const categoryData = [300, 50, 100];

    // Configuración para el gráfico de barras
    const barChartOptions: ChartOptions<'bar'> = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Inventario por Producto'
        }
      }
    };

    const barChartConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
        datasets: [{
          label: 'Inventario',
          data: inventoryData,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC']
        }]
      },
      options: barChartOptions
    };

    // Configuración para el gráfico de líneas
    const lineChartOptions: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Ventas Mensuales'
        }
      }
    };

    const lineChartConfig: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
          label: 'Ventas',
          data: salesData,
          borderColor: '#42A5F5',
          fill: 'origin'
        }]
      },
      options: lineChartOptions
    };

    // Configuración para el gráfico de pastel
    const pieChartOptions: ChartOptions<'pie'> = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribución por Categoría'
        }
      },
      animation: {
        animateScale: true
      }
    };

    const pieChartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Categoría A', 'Categoría B', 'Categoría C'],
        datasets: [{
          data: categoryData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: pieChartOptions
    };

    // Obtener los elementos Canvas
    const barCanvas = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    const lineCanvas = document.getElementById('lineChartCanvas') as HTMLCanvasElement;
    const pieCanvas = document.getElementById('pieChartCanvas') as HTMLCanvasElement;

    // Crear los gráficos
    this.barChart = new Chart(barCanvas, barChartConfig);
    this.lineChart = new Chart(lineCanvas, lineChartConfig);
    this.pieChart = new Chart(pieCanvas, pieChartConfig);
  }
}
