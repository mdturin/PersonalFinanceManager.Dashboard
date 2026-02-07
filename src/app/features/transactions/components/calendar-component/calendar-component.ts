import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.scss',
})
export class CalendarComponent implements OnInit {
  @Input() transactions: any[] = [];
  calendarDays: any[] = [];

  ngOnInit() {
    this.buildCalendar();
  }

  buildCalendar() {
    const start = new Date();
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    this.calendarDays = Array.from({ length: daysInMonth }).map((_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
      return {
        date,
        transactions: this.transactions.filter(
          (t) => new Date(t.date).toDateString() === date.toDateString(),
        ),
      };
    });
  }
}
