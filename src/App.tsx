import { useEffect } from "react";
import "./App.css";
import { TransformableWrapper } from "./components/TransformableWrapper";
import type { Widget } from "./types";
import { useWidgetStore } from "./store";
import { UnionWidget } from "./components/UnionWidget";
import { useSnapshot } from "./hooks/useSnapshot";
import { widgetsList } from "./mock/widgetData";

function App() {
  const {
    widgets,
    setWidgets,
    undo,
    redo,
    updateWidget,
    isActive,
    setIsActive,
  } = useWidgetStore();

  const { containerRef, handleSnapshot } = useSnapshot();

  useEffect(() => {
    setWidgets(widgetsList);
  }, [widgetsList]);

  const log = () => console.log(JSON.stringify(widgets, null, 2));

  const onButtonClick = () => {
    log();
    const active = isActive;
    setIsActive(false);
    setTimeout(() => {
      handleSnapshot({ download: true });

      if (active) {
        setIsActive(true);
      }
    }, 0);
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "800px",
          height: "600px",
          border: "1px solid #ddd",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {Object.values(widgets).map((widget: Widget) => (
          <TransformableWrapper
            key={widget.id}
            widgetParams={widget.params}
            setWidgetParams={(params) => updateWidget(widget.id, params)}
            isActive={isActive}
          >
            <UnionWidget widget={widget.data} type={widget.type} />
          </TransformableWrapper>
        ))}
      </div>
      <button onClick={onButtonClick} type="button">
        log and handleSnapshot
      </button>
      <button onClick={() => setIsActive(!isActive)} type="button">
        Toggle Active
      </button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </>
  );
}

export default App;
