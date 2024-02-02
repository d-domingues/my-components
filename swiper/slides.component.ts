import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { BIG_VIEWPORT, coerceString, SMALL_VIEWPORT } from '@cbo-core';
import { FetchStatus, SwiperContainer } from '@cbo-models';
import { AlertComponent, CboAdd, SwiperSlideButtons } from '@cbo-ui';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { firstValueFrom } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { MainSlidesDirective, SecondarySlidesDirective, SlidesSkeletonDirective } from './slides.module';

@Component({
  selector: 'cbo-slides',
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    CboAdd,
    IonicModule,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
    SwiperSlideButtons,
    TranslocoModule
  ],
  templateUrl: 'slides.component.html',
  styleUrls: ['slides.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Slides {
  @HostBinding('class') colorClass = '';
  @ContentChild(MainSlidesDirective) mainSlides!: MainSlidesDirective;
  @ContentChild(SecondarySlidesDirective) scndSlides?: SecondarySlidesDirective;
  @ContentChild(SlidesSkeletonDirective) skeleton?: SlidesSkeletonDirective;
  @ViewChild('swiper', { static: true }) swiperEl!: ElementRef<SwiperContainer>;
  @ViewChildren('vSwiper') vSwiperElements!: QueryList<ElementRef<SwiperContainer>>;

  @Input() options: SwiperOptions = {};
  @Input() status?: FetchStatus;
  @Input()
  set color(value: string) {
    this.colorClass = value ? `ion-color-${value}` : '';
  }

  @Output() viewMoreClick = new EventEmitter();
  @Output() addButtonClick = new EventEmitter();
  @Output() slidePrevClick = new EventEmitter();
  @Output() slideNextClick = new EventEmitter();
  @Output() slideChange = new EventEmitter();

  smallViewport$ = inject(SMALL_VIEWPORT);
  bigViewport$ = inject(BIG_VIEWPORT);

  get hasAddButton() {
    return this.addButtonClick.observed;
  }

  get loading() {
    return this.status === 'loading' || !this.mainSlides.items?.length;
  }

  get case(): FetchStatus {
    const fetchStatus = this.status ?? 'success';
    this.setSlidesPerView(fetchStatus);
    if (fetchStatus !== 'loading') return fetchStatus;
    else if (this.skeleton && this.loading) return 'loading';
    else return 'success';
  }

  private ref = inject(ChangeDetectorRef);

  async ngAfterViewInit() {
    const swiper = this?.swiperEl?.nativeElement;

    if (swiper) {
      Object.assign(swiper, this.options);
      const isSmallViewport = await firstValueFrom(this.smallViewport$);
      swiper['pagination'] = isSmallViewport;
      swiper.initialize();
    } else {
      throw 'No swiper element found';
    }
  }

  setSlidesPerView(status: FetchStatus) {
    const swiper = this.swiperEl.nativeElement;
    const spv = status === 'no-data' || status === 'error' ? '1' : this.options.slidesPerView ?? '1';
    if (swiper.getAttribute('slides-per-view') === spv) return;
    swiper.setAttribute('slides-per-view', coerceString(spv) as string);
  }

  update() {
    const swiperInstance = this.swiperEl?.nativeElement?.['swiper'];
    swiperInstance?.slideTo?.(0);
    swiperInstance?.update?.();
    this.ref.detectChanges();
  }

  toggleSecondary(showSndry: boolean) {
    this.vSwiperElements?.forEach((el) => {
      const swiper = el.nativeElement?.['swiper'];
      swiper?.slideTo(showSndry ? 1 : 0);
    });
  }
}
