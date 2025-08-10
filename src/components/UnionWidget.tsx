import type { IImageWidget, ITextWidget, WidgetType } from "../types";
import { ImageWidget } from "./ImageWidget";
import { TextWidget } from "./TextWidget";

export type UnionWidgetType = ITextWidget | IImageWidget;

export interface UnionWidgetProps {
  widget: UnionWidgetType;
  type: WidgetType;
}
export const UnionWidget: React.FC<UnionWidgetProps> = ({ widget, type }) => {
  switch (type) {
    case "text":
      return <TextWidget {...(widget as ITextWidget)} />;
    case "image":
      return <ImageWidget {...(widget as IImageWidget)} />;
    default:
      return null;
  }
};
