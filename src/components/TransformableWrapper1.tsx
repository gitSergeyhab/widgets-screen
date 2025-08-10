import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

type TransformableWrapperProps = {
  children: React.ReactNode;
  id: number;
  movedId: number | null;
  setMobed: VoidFunction; // passed like: () => setMovedId(id)
};

export const TransformableWrapper1: React.FC<TransformableWrapperProps> = ({
  children,
  id,
  setMobed,
  movedId,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState({
    translate: [0, 0],
    rotate: 0,
    scale: [1, 1],
  });

  // This handler selects the element and — if it was NOT selected yet —
  // immediately starts a manual pointer-based drag so the element moves
  // on the same pointer gesture that the user started.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // only left button
    if (e.button !== 0) return;

    // select (parent will set movedId)
    setMobed();

    // make sure Moveable has the element reference right away
    targetRef.current = e.currentTarget as HTMLDivElement;

    // if it was already selected, let Moveable handle the drag
    if (id === movedId) {
      return;
    }

    // otherwise start manual dragging (translate only) so movement begins immediately
    const startX = e.clientX;
    const startY = e.clientY;
    const startTranslate = [...frame.translate] as [number, number];

    // pointermove/up handlers
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setFrame((prev) => ({
        ...prev,
        translate: [startTranslate[0] + dx, startTranslate[1] + dy],
      }));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // try to capture the pointer on the pressed element so we reliably get moves
    try {
      (e.currentTarget as Element).setPointerCapture?.(
        (e as unknown as PointerEvent).pointerId
      );
    } catch (error) {
      console.warn("Failed to capture pointer:", error);
      // ignore
    }
  };

  return (
    <>
      <div
        onPointerDown={handlePointerDown}
        ref={id === movedId ? targetRef : null}
        style={{
          cursor: id === movedId ? "grabbing" : "pointer",
          display: "inline-block",
          transform: `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `,
          transformOrigin: "center center",
          border: "1px dashed gray",
          padding: "10px",
          background: "rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>

      <Moveable
        target={targetRef}
        draggable
        rotatable
        scalable
        keepRatio={false}
        origin={false}
        onDrag={(e) => {
          // when Moveable does the drag, use its beforeTranslate
          setFrame((prev) => ({
            ...prev,
            translate: [e.beforeTranslate[0], e.beforeTranslate[1]],
          }));
        }}
        onRotate={(e) => {
          setFrame((prev) => ({ ...prev, rotate: e.beforeRotate }));
        }}
        onScale={(e) => {
          setFrame((prev) => ({ ...prev, scale: [e.scale[0], e.scale[1]] }));
        }}
      />
    </>
  );
};
