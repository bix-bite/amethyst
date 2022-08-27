import { Component } from '@angular/core';

/**
 * This holds info for a single subject
 */
 class Subject {
  name: string;
  start: string;
  end: string;

  constructor(name: string,start: string,  end: string) {
    this.name = name;
    this.start = start;
    this.end = end;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  subjects: Subject[] = [];

  targetStart?: string;
  targetEnd?: string;

  // thisaldsfkj

  /** subject entered by Lachlan on the UI */
  subject?: string;
  start?: string;
  end?: string;

  AddSubject() {
    const subject =  new Subject(this.subject as string, this.start as string, this.end as string);
    this.subjects.push(subject);
  }

}


