import type { IImageWidget } from "../types";

export const ImageWidget: React.FC<IImageWidget> = ({
  src,
  alt,
  width,
  height,
}) => {
  return (
    <div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};
