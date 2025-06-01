/// <reference types="vite/client" />

declare module 'dom-to-image-more' {
  interface DomToImage {
    toSvg(node: HTMLElement, options?: any): Promise<string>;
    toPng(node: HTMLElement, options?: any): Promise<string>;
    toJpeg(node: HTMLElement, options?: any): Promise<string>;
    toBlob(node: HTMLElement, options?: any): Promise<Blob>;
  }
  const domtoimage: DomToImage;
  export default domtoimage;
}