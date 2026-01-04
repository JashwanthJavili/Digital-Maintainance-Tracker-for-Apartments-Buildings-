import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <div class="chart-bars">
          <div *ngFor="let item of data" class="bar-item">
            <div class="bar-container">
              <div class="bar-fill" [style.height.%]="getPercentage(item.value)" [style.background]="item.color">
                <span class="bar-value">{{ item.value }}</span>
              </div>
            </div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
    }

    .chart-title {
      font-size: 20px;
      font-weight: 600;
      color: #4A3829;
      margin-bottom: 24px;
      text-align: center;
    }

    .chart-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .chart-bars {
      display: flex;
      gap: 20px;
      min-height: 250px;
      align-items: flex-end;
      justify-content: center;
      padding: 20px 0;
    }

    .bar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      min-width: 80px;
    }

    .bar-container {
      width: 60px;
      height: 200px;
      background: #F5EFE7;
      border-radius: 8px 8px 0 0;
      position: relative;
      display: flex;
      align-items: flex-end;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }

    .bar-fill {
      width: 100%;
      border-radius: 6px 6px 0 0;
      transition: all 0.6s ease;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 8px;
      min-height: 30px;
      position: relative;
      animation: growBar 1s ease-out;
    }

    @keyframes growBar {
      from {
        height: 0;
      }
    }

    .bar-value {
      color: white;
      font-weight: 700;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    .bar-label {
      font-size: 14px;
      font-weight: 600;
      color: #4A3829;
      text-align: center;
    }

    @media (max-width: 768px) {
      .chart-bars {
        gap: 12px;
      }

      .bar-item {
        min-width: 60px;
      }

      .bar-container {
        width: 50px;
        height: 180px;
      }
    }
  `]
})
export class StatsChartComponent implements OnInit {
  @Input() title: string = 'Statistics';
  @Input() data: Array<{ label: string; value: number; color: string }> = [];

  ngOnInit() {
    // Calculate max value for percentage calculation
    this.maxValue = Math.max(...this.data.map(d => d.value), 1);
  }

  maxValue: number = 1;

  getPercentage(value: number): number {
    return (value / this.maxValue) * 100;
  }
}
