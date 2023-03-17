import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements OnInit {
  @Input() for?: string = null;
  @Input() type?: string = null;
  @Input() placeholder?: string;
  @Input() name?: string;
  @Input() readonly?: boolean;
  @Input() className?: string;
  @Input() value?: string | Date | number;
  @Input() class?: string;

  constructor() {
    if (this.type === 'date') {
      this.value = new Date();
      console.log(this.value);
    }
  }
  ngOnInit(): void {}
}
