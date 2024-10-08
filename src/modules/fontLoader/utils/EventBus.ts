import type { FontsLoaderConfig } from '../types';

export enum FontEvents {
  LOADING = 'loading',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FONT_LOADING = 'fontloading',
  FONT_ACTIVE = 'fontactive',
  FONT_INACTIVE = 'fontinactive',
}

export class EventBus {
  private namespace_ = 'wf';
  private classSeparator_ = '-';
  private event_: Event;
  private config_: FontsLoaderConfig;
  private htmlElement_;

  constructor(config: FontsLoaderConfig) {
    this.config_ = config;
    this.event_ = document.createEvent('CustomEvent');
    this.htmlElement_ = document.documentElement;
    document.addEventListener(
      FontEvents.LOADING,
      () => {
        this.handleLoading_();
      },
      false
    );
    document.addEventListener(
      FontEvents.ACTIVE,
      () => {
        this.handleActive_();
      },
      false
    );
    document.addEventListener(
      FontEvents.INACTIVE,
      () => {
        this.handleInactive_();
      },
      false
    );
    document.addEventListener(
      FontEvents.FONT_LOADING,
      (event) => {
        const { detail } = event as CustomEvent;
        this.handleFontLoading_(detail);
      },
      false
    );
    document.addEventListener(
      FontEvents.FONT_ACTIVE,
      (event) => {
        const { detail } = event as CustomEvent;
        this.handleFontActive_(detail);
      },
      false
    );
    document.addEventListener(
      FontEvents.FONT_INACTIVE,
      (event) => {
        const { detail } = event as CustomEvent;
        this.handleFontInactive_(detail);
      },
      false
    );
  }

  private handleLoading_() {
    if (this.config_.events && this.config_.loading) {
      this.config_.loading.call(null);
      this.addClassToHtml_(FontEvents.LOADING);
      this.removeClassFromHtml_(FontEvents.ACTIVE);
      this.removeClassFromHtml_(FontEvents.INACTIVE);
    }
  }

  private handleActive_() {
    if (this.config_.events && this.config_.active) {
      this.config_.active.call(null);
      this.removeClassFromHtml_(FontEvents.LOADING);
      this.addClassToHtml_(FontEvents.ACTIVE);
      this.removeClassFromHtml_(FontEvents.INACTIVE);
    }
  }

  private handleInactive_() {
    if (this.config_.events && this.config_.inactive) {
      this.config_.inactive.call(null);
      this.removeClassFromHtml_(FontEvents.LOADING);
      this.removeClassFromHtml_(FontEvents.ACTIVE);
      this.addClassToHtml_(FontEvents.INACTIVE);
    }
  }

  private handleFontLoading_(font: string) {
    if (this.config_.events && this.config_.fontloading) {
      const fontArray = font.split(':');
      this.config_.fontloading.call(null, fontArray[0], fontArray[1]);
      this.addClassToHtml_(FontEvents.LOADING, [fontArray[0], fontArray[1]]);
      this.removeClassFromHtml_(FontEvents.ACTIVE, [fontArray[0], fontArray[1]]);
      this.removeClassFromHtml_(FontEvents.INACTIVE, [fontArray[0], fontArray[1]]);
    }
  }

  private handleFontActive_(font: string) {
    if (this.config_.events && this.config_.fontactive) {
      const fontArray = font.split(':');
      this.config_.fontactive.call(null, fontArray[0], fontArray[1]);
      this.removeClassFromHtml_(FontEvents.LOADING, [fontArray[0], fontArray[1]]);
      this.addClassToHtml_(FontEvents.ACTIVE, [fontArray[0], fontArray[1]]);
      this.removeClassFromHtml_(FontEvents.INACTIVE, [fontArray[0], fontArray[1]]);
    }
  }

  private handleFontInactive_(font: string) {
    if (this.config_.events && this.config_.fontinactive) {
      const fontArray = font.split(':');
      this.config_.fontinactive.call(null, fontArray[0], fontArray[1]);
      this.removeClassFromHtml_(FontEvents.LOADING, [fontArray[0], fontArray[1]]);
      this.removeClassFromHtml_(FontEvents.ACTIVE, [fontArray[0], fontArray[1]]);
      this.addClassToHtml_(FontEvents.INACTIVE, [fontArray[0], fontArray[1]]);
    }
  }

  private addClassToHtml_(className: string, prefix: string[] = []) {
    this.htmlElement_.classList.add(
      [this.namespace_].concat(prefix.map(this.sanitizeClassName_), className).join(this.classSeparator_)
    );
  }

  private removeClassFromHtml_(className: string, prefix: string[] = []) {
    this.htmlElement_.classList.remove(
      [this.namespace_].concat(prefix.map(this.sanitizeClassName_), className).join(this.classSeparator_)
    );
  }

  private sanitizeClassName_(className: string) {
    return className.replace(/[\W_]+/g, '').toLowerCase();
  }
}
