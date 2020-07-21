import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDirDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
