import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[Arrow]',
  standalone: true,
})
export class ArrowDirective {
  private wrapperElement: HTMLElement;
  private arrowElement: HTMLElement;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Create a wrapper element
    this.wrapperElement = this.renderer.createElement('span');
    this.renderer.setStyle(this.wrapperElement, 'display', 'flex');
    this.renderer.setStyle(this.wrapperElement, 'align-items', 'center');
    this.renderer.setStyle(this.wrapperElement, 'cursor', 'pointer');

    // Wrap the host element
    const parent = this.el.nativeElement.parentNode;
    this.renderer.insertBefore(
      parent,
      this.wrapperElement,
      this.el.nativeElement
    );
    this.renderer.appendChild(this.wrapperElement, this.el.nativeElement);

    // Create the arrow element
    this.arrowElement = this.renderer.createElement('span');
    this.renderer.addClass(this.arrowElement, 'arrow');
    this.renderer.setStyle(this.arrowElement, 'display', 'inline-block');
    this.renderer.setStyle(
      this.arrowElement,
      'transition',
      'transform 0.3s ease'
    );
    this.renderer.setProperty(this.arrowElement, 'innerHTML', '&#9654;'); // Right arrow

    // Append the arrow element to the wrapper
    this.renderer.appendChild(this.wrapperElement, this.arrowElement);
  }

  @HostListener('mouseover') onMouseOver() {
    this.renderer.setStyle(this.arrowElement, 'transform', 'rotate(90deg)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.arrowElement, 'transform', 'rotate(0deg)');
  }
}
