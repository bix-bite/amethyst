import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from 'ngx-localstorage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** subject entered by Lachlan on the UI */
  newSubject?: string;
  newStart?: Date;
  newEnd?: Date;

  model = new Model();

  today = new Date();
  totalDaysInPeriod = 0;
  daysElapsed = 0;
  currentPercent = 0;

  constructor(private _storageService: LocalStorageService) { }

  ngOnInit(): void {
    const stored = this._storageService.get('data');

    if (stored !== null && stored !== undefined) {
      this.model = stored as Model;
    }
    this.Update();

  }

  AddSubject() {
    const subject =  new Subject(this.newSubject as string, this.newStart as Date, this.newEnd as Date);

    if (this.model.subjects === undefined) {
      this.model.subjects = [];
    }
    this.model.subjects.push(subject);
    this.newSubject = undefined;
    this.Update();
  }

  Update() {
    this._storageService.set('data', this.model);

    if (this.model.targetEnd && this.model.targetStart) {
      this.totalDaysInPeriod = this.GetDaysBetween(new Date(this.model.targetStart), new Date(this.model.targetEnd));
      this.daysElapsed  = this.GetDaysBetween(new Date(this.model.targetStart), new Date(this.today));
      this.currentPercent = this.nicePercent(this.daysElapsed / this.totalDaysInPeriod);

      this.model.subjects?.forEach(subject => {
        const percent = subject.franklinPercentComplete || 0;
        if (Math.abs(this.currentPercent - percent) < 1.5) {
          subject.status = 'On Track';
          subject.class = 'table-primary';
        } else if (this.currentPercent > percent) {
          subject.status = 'Behind';
          subject.class = 'table-warning';
        } else {
          subject.status = 'Ahead';
          subject.class = 'table-success';
        }
      });
    }


  }

  nicePercent(rawPercent: number): number {
    return Math.round(rawPercent * 1000)/10;
  }

  GetDaysBetween (start: Date, end: Date): number {
    const differenceMs = end.getTime() - start.getTime();
    const differenceDays = differenceMs / (1000 * 3600 * 24);
    const weeks = differenceDays / 7;
    const weekDays = weeks * 5;

    return weekDays;
  }

}

class Model {
  targetStart?: Date;
  targetEnd?: Date;
  subjects?: Subject[];
}


/**
 * This holds info for a single subject
 */
 class Subject {

  franklinPercentComplete?: number;

  status?: 'On Track' | 'Behind' | 'Ahead'

  class?: 'table-primary' | 'table-warning' | 'table-success';

  constructor(public name: string, public start: Date,  public end: Date) { }
}
