import React, { useRef } from "react";
import Moveable from "react-moveable";

export interface WitgetParams {
  translate: [number, number];
  rotate: number;
  scale: [number, number];
}

type TransformableWrapperProps = {
  children: React.ReactNode;
  //   id: number;
  //   movedId: number | null;
  //   setMobed: VoidFunction;
  widgetParams: WitgetParams;
  setWidgetParams: (widget: WitgetParams) => void;
  isActive: boolean;
};

export const TransformableWrapper: React.FC<TransformableWrapperProps> = ({
  children,
  //   id,
  //   setMobed,
  //   movedId,
  widgetParams,
  setWidgetParams,
  isActive,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  //   const [frame, setFrame] = useState({
  //     translate: [0, 0],
  //     rotate: 0,
  //     scale: [1, 1],
  //   });

  const { rotate, translate, scale } = widgetParams;

  return (
    <>
      <div
        // onDragStart={setMobed}
        // onClick={setMobed}
        // onMouseDown={setMobed}
        // ref={id === movedId ? targetRef : null}
        // ref={targetRef}
        ref={isActive ? targetRef : null}
        style={{
          //   cursor: id === movedId ? "grabbing" : "pointer",
          cursor: "grab",
          display: "inline-block",
          transform: `
            translate(${translate[0]}px, ${translate[1]}px)
            rotate(${rotate}deg)
            scale(${scale[0]}, ${scale[1]})
          `,
          transformOrigin: "center center",
          //   border: "1px dashed gray",
          //   padding: "10px",
          //   background: "rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>

      <Moveable
        target={targetRef}
        // onDragStart={() => setMobed()}
        draggable
        rotatable
        scalable
        keepRatio={false}
        origin={false}
        onDrag={(e) => {
          // when Moveable does the drag, use its beforeTranslate
          setWidgetParams({
            ...widgetParams,
            translate: [e.beforeTranslate[0], e.beforeTranslate[1]],
          });
        }}
        onRotate={(e) => {
          setWidgetParams({ ...widgetParams, rotate: e.beforeRotation });
        }}
        onScale={(e) => {
          setWidgetParams({ ...widgetParams, scale: [e.scale[0], e.scale[1]] });
        }}
      />
    </>
  );
};
