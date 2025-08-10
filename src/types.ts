export type WidgetType = "text" | "image";

export interface ITextWidget {
  text: string;
  color: string;
  bgColor: string;
}

export interface IImageWidget {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface WidgetParams {
  translate: [number, number];
  rotate: number;
  scale: [number, number];
}

export interface Widget {
  params: WidgetParams;
  data: ITextWidget | IImageWidget;
  id: number;
  type: WidgetType;
}
