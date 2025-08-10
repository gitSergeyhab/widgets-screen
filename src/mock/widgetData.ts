import type { Widget } from "../types";

export const widgetsList: Widget[] = [
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
      src: "/img/image.jpg",
      alt: "Placeholder Image",
      width: 100,
      height: 200,
    },
    id: 2,
    type: "image",
  },
];
