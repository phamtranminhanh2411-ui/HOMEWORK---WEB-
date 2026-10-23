import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-class-component',
  standalone: false,
  styleUrl: './binding-class-component.css',
  templateUrl: './binding-class-component.html',
})
export class BindingClassComponent {
  // logic state
  isSaved: boolean = false;
  isActive: boolean = true;
  // event handler methodt
  toggleSaveState(){
    this.isSaved = !this.isSaved
  }
}
