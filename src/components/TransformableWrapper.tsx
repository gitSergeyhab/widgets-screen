// import React, { useRef } from "react";
// import Moveable from "react-moveable";

export interface WitgetParams {
  translate: [number, number];
  rotate: number;
  scale: [number, number];
}

type TransformableWrapperProps = {
  children: React.ReactNode;
  widgetParams: WitgetParams;
  setWidgetParams: (widget: WitgetParams) => void;
  isActive: boolean;
};

// import { useWidgetStore } from "../store";

// export const TransformableWrapper: React.FC<TransformableWrapperProps> = ({
//   children,
//   widgetParams,
//   setWidgetParams,
//   isActive,
// }) => {
//   const targetRef = useRef<HTMLDivElement>(null);
//   const { startHistoryGroup, endHistoryGroup } = useWidgetStore();

//   const { rotate, translate, scale } = widgetParams;

//   return (
//     <>
//       <div
//         ref={isActive ? targetRef : null}
//         style={{
//           cursor: "grab",
//           display: "inline-block",
//           transform: `
//             translate(${translate[0]}px, ${translate[1]}px)
//             rotate(${rotate}deg)
//             scale(${scale[0]}, ${scale[1]})
//           `,
//           transformOrigin: "center center",
//         }}
//       >
//         {children}
//       </div>

//       <Moveable
//         target={isActive ? targetRef : null}
//         draggable
//         rotatable
//         scalable
//         keepRatio={false}
//         origin={false}
//         // Начало любой операции
//         onDragStart={() => startHistoryGroup()}
//         onRotateStart={() => startHistoryGroup()}
//         onScaleStart={() => startHistoryGroup()}
//         // Во время изменения — не пишем в историю
//         onDrag={(e) => {
//           setWidgetParams({
//             ...widgetParams,
//             translate: [e.beforeTranslate[0], e.beforeTranslate[1]],
//           });
//         }}
//         onRotate={(e) => {
//           setWidgetParams({ ...widgetParams, rotate: e.beforeRotation });
//         }}
//         onScale={(e) => {
//           setWidgetParams({ ...widgetParams, scale: [e.scale[0], e.scale[1]] });
//         }}
//         // Конец операции
//         onDragEnd={() => endHistoryGroup()}
//         onRotateEnd={() => endHistoryGroup()}
//         onScaleEnd={() => endHistoryGroup()}
//       />
//     </>
//   );
// };

import { useWidgetStore } from "../store";
import { useEffect, useRef } from "react";
import Moveable from "react-moveable";

export const TransformableWrapper: React.FC<TransformableWrapperProps> = ({
  children,
  widgetParams,
  setWidgetParams,
  isActive,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);
  const { startHistoryGroup, endHistoryGroup, widgets } = useWidgetStore();

  const { rotate, translate, scale } = widgetParams;

  // Когда виджет обновился (в том числе через undo/redo) — обновляем рамку
  useEffect(() => {
    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  }, [widgetParams, widgets]); // можно оставить только widgetParams

  return (
    <>
      <div
        ref={isActive ? targetRef : null}
        style={{
          cursor: "grab",
          display: "inline-block",
          transform: `
            translate(${translate[0]}px, ${translate[1]}px)
            rotate(${rotate}deg)
            scale(${scale[0]}, ${scale[1]})
          `,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>

      <Moveable
        ref={moveableRef}
        target={targetRef}
        draggable
        rotatable
        scalable
        keepRatio={false}
        origin={false}
        onDragStart={() => startHistoryGroup()}
        onRotateStart={() => startHistoryGroup()}
        onScaleStart={() => startHistoryGroup()}
        onDrag={(e) => {
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
        onDragEnd={() => endHistoryGroup()}
        onRotateEnd={() => endHistoryGroup()}
        onScaleEnd={() => endHistoryGroup()}
      />
    </>
  );
};
