import { MarkedRenderer } from 'ngx-markdown';

export class FramesystemRenderer extends MarkedRenderer {
  heading(text: string, level, raw, slugger) {
    if (text.endsWith('!')) {
      return `<h1 class="hero">${text.substr(0, text.length - 1)}</h1>`;
    } else {
      return super.heading(text, level, raw, slugger);
    }
  }
}
