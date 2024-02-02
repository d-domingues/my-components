import { Directive, inject, Input, NgModule, TemplateRef } from '@angular/core';

import { Slides } from './slides.component';

/* eslint-disable @angular-eslint/no-input-rename */
@Directive({
  selector: '[cboMainSlides]',
  standalone: true
})
export class MainSlidesDirective {
  @Input('cboMainSlidesOf') items: unknown[] | null | undefined = [];

  tmpl = inject(TemplateRef<null>);
  slidesComponent = inject(Slides);

  ngOnChanges() {
    // TODO: payment cards is not updating correctily
    setTimeout(() => this.slidesComponent.update());
  }
}

@Directive({
  selector: '[cboSecondarySlides]',
  standalone: true
})
export class SecondarySlidesDirective {
  @Input('cboSecondarySlidesOf') items!: unknown[] | null | undefined;
  @Input('cboSecondarySlidesLabel') label = '';

  tmpl = inject(TemplateRef<null>);
}

@Directive({
  selector: '[cboSlidesSkeleton]',
  standalone: true
})
export class SlidesSkeletonDirective {
  tmpl = inject(TemplateRef<null>);
}

@NgModule({
  imports: [Slides, MainSlidesDirective, SecondarySlidesDirective, SlidesSkeletonDirective],
  exports: [Slides, MainSlidesDirective, SecondarySlidesDirective, SlidesSkeletonDirective]
})
export class SlidesModule {}
