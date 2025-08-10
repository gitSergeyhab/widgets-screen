import { useEffect, useState } from "react";
import "./App.css";
import { TransformableWrapper } from "./components/TransformableWrapper";
import type { Widget } from "./types";
import { useWidgetStore } from "./store";
import { UnionWidget } from "./components/UnionWidget";

const widgetsList: Widget[] = [
  {
    params: {
      translate: [0, 0],
      rotate: 0,
      scale: [1, 1],
    },
    data: {
      text: "Hello World",
      color: "#000",
      bgColor: "#fff",
    },
    id: 1,
    type: "text",
  },
  {
    params: {
      translate: [100, 100],
      rotate: 0,
      scale: [1, 1],
    },
    data: {
      src: "https://i.pinimg.com/originals/3f/63/9f/3f639fd816a68ad71cbe6505658edb40.jpg",
      alt: "Placeholder Image",
      width: 200,
      height: 100,
    },
    id: 2,
    type: "image",
  },
];

function App() {
  const {
    widgets,

    setWidgets,
    // addWidget,
    updateWidget,
    // removeWidget,
    // updateWidgetType,
  } = useWidgetStore();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setWidgets(widgetsList);
  }, [widgetsList]);

  const log = () => console.log(JSON.stringify(widgets, null, 2));

  return (
    <>
      <div
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
      <button onClick={log} type="button">
        log
      </button>
      <button onClick={() => setIsActive(!isActive)} type="button">
        Toggle Active
      </button>
    </>
  );
}

export default App;
