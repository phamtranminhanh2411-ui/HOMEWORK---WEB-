import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-event-component',
  standalone: false,
  styleUrl: './binding-event-component.css',
  templateUrl: './binding-event-component.html',
})
export class BindingEventComponent {
  public hsa: string = "5";
  public hsb: string = "8";
  giaiPt(hsa: string, hsb: string, view: HTMLElement) {
    const hsaNum = parseFloat(hsa);
    const hsbNum = parseFloat(hsb);
    if (hsaNum === 0 && hsbNum === 0) {
      view.innerHTML = "Phương trình vô số nghiệm";
    } else if (hsaNum === 0 && hsbNum !== 0) {
      view.innerHTML = "Phương trình vô nghiệm";
    } else {
      view.innerHTML = "x=" + (-hsbNum / hsaNum);
    }
  }
  // let tdketqua2=document.getElementById("tdketqua2");
  // // tdketqua2?.innerHTML
}
