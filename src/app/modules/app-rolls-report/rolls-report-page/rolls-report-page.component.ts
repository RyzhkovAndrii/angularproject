import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RollsService } from '../../app-rolls/services/rolls.service';
import { RollsReportService } from '../services/rolls-report.service';
import { RollReport } from '../models/roll-report.model';
import { compareRollTypes } from '../../../app-utils/app-comparators';
import { formatDateServerToBrowser } from '../../../app-utils/app-date-utils';

interface RollReportTableRow {
  roll: RollType;
  report: RollReport;
}

@Component({
  selector: 'app-rolls-report-page',
  templateUrl: './rolls-report-page.component.html',
  styleUrls: ['./rolls-report-page.component.css']
})
export class RollsReportPageComponent implements OnInit {

  reportsTable: RollReportTableRow[] = [];

  from: Date;
  to: Date;
  dateForm: FormGroup;

  constructor(
    private rollService: RollsService,
    private rollsReportService: RollsReportService
  ) { }

  ngOnInit() {
    this.from = new Date(new Date().setMonth(new Date().getMonth() - 1));
    this.to = new Date();
    this.dateForm = new FormGroup({
      'fromDate': new FormControl(formatDateServerToBrowser(this.from), [Validators.required]),
      'toDate': new FormControl(formatDateServerToBrowser(this.to), [Validators.required])
    });
    this.loadData(this.from, this.to);
  }

  private loadData(from: Date, to: Date) {
    this.rollsReportService
      .getAll(from, to)
      .subscribe(reports => {
        Observable.forkJoin(reports.map(report => this.rollService.getRollType(report.rollTypeId)))
          .subscribe(rolls => {
            this.reportsTable = rolls
              .sort((r1, r2) => compareRollTypes(r1, r2))
              .map(roll => {
                return {
                  roll: roll,
                  report: reports.find(report => report.rollTypeId === roll.id)
                };
              });
          });
      });
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight === rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }

  getDeviation(report: RollReport) {
    return report.actualAmount - report.planAmount;
  }

  getDeviationInPercent(report: RollReport) {
    return Math.abs(this.getDeviation(report) / report.planAmount * 100).toFixed(1);
  }

  changeDate() {
    const { fromDate, toDate} = this.dateForm.value;
    this.from = new Date(fromDate);
    this.to = new Date(toDate);
    this.loadData(this.from, this.to);
  }

}
