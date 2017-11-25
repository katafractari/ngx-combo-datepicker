import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[customAttrs]'
})
export class AttributesDirective implements OnInit {
  @Input()
  attrs: object;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    Object.keys(this.attrs).forEach((key) =>
      this.renderer.setAttribute(this.element.nativeElement, key, this.attrs[key]));
  }
}
