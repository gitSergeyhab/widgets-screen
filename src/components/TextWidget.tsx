import type { ITextWidget } from "../types";

export const TextWidget: React.FC<ITextWidget> = ({ text, color, bgColor }) => {
  return (
    <div
      style={{
        color,
        backgroundColor: bgColor,
      }}
    >
      {text}
    </div>
  );
};
