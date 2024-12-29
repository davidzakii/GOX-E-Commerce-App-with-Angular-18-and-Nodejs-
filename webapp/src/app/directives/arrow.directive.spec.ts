import { ArrowDirective } from './arrow.directive';

describe('ArrowDirective', () => {
  it('should create an instance', () => {
    const elRefMock = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    const rendererMock = jasmine.createSpyObj('Renderer2', ['setStyle']);
    const directive = new ArrowDirective(elRefMock, rendererMock);
    expect(directive).toBeTruthy();
  });
});


