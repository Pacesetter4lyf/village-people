import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { respType } from 'src/app/shared/types/response.type';
import { environment } from 'src/environments/environment';
import { IndividualService } from '../../personal/individual.service';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import { beginDataFetch } from '../../personal/store/individual.actions';
const apiUrl = environment.apiUrl;

interface BirthdayInterface {
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  daysRemaining: number;
  daysPassed: number;
  id: string;
}

@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.css'],
})
export class BirthdaysComponent implements OnInit {
  birthdays: BirthdayInterface[];
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<frmApp.AppState>
  ) {}
  ngOnInit() {
    this.http
      .get<respType<BirthdayInterface[]>>(`${apiUrl}/userdata/birthdays`)
      .subscribe((resp) => {
        const data = resp.data.data;
        const newData = data.map((birthday) => {
          const date = new Date(birthday.dateOfBirth);
          const formattedDate = date.toLocaleString('default', {
            month: 'short',
            day: '2-digit',
          });
          birthday.dateOfBirth = formattedDate;
          birthday.daysRemaining = this.calculateDays(date, false);
          birthday.daysPassed = this.calculateDays(date, true);
          return birthday;
        });

        this.birthdays = newData;
        // console.log(this.birthdays);
      });
  }

  calculateDays(inputDate, isDaysPassed) {
    const currentYear = new Date().getFullYear();
    const targetMonthDay = new Date(
      currentYear,
      inputDate.getMonth(),
      inputDate.getDate()
    );

    if (
      (!isDaysPassed && targetMonthDay < new Date()) ||
      (isDaysPassed && targetMonthDay > new Date())
    ) {
      targetMonthDay.setFullYear(currentYear + (isDaysPassed ? -1 : 1));
    }

    const timeDiff = isDaysPassed
      ? new Date().getTime() - targetMonthDay.getTime()
      : targetMonthDay.getTime() - new Date().getTime();

    return Math.abs(Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
  }

  showDetails(id: string) {
    this.store.dispatch(beginDataFetch({ id, isSelf: false }));
    this.router.navigate(['/individual']);
  }
}
