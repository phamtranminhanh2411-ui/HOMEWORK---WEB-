import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-property-component',
  standalone: false,
  styleUrl: './binding-property-component.css',
  templateUrl: './binding-property-component.html',
})
export class BindingPropertyComponent {
  public name: string = 'Nguyen tien dat';
  public email: string = 'dat20082006';
  public nameid: string = 'nameid'
  public emailid: string = 'emailid'
  public isDesabled: boolean = true
  public hello: string = 'Hello'
}
