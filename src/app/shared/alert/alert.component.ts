import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Output() closeBox = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClose() {
    this.closeBox.emit();
  }
}
