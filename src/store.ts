import { create } from "zustand";
import type { Widget, WidgetParams, WidgetType } from "./types";

interface WidgetDictionary {
  [id: number]: Widget;
}

export interface StoreState {
  widgets: WidgetDictionary;
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: number, params: WidgetParams) => void;
  removeWidget: (id: number) => void;
  updateWidgetType: (id: number, type: WidgetType) => void;
}

export const useWidgetStore = create<StoreState>((set) => ({
  widgets: {},
  setWidgets: (widgets: Widget[]) =>
    set(() => ({
      widgets: widgets.reduce((acc, widget) => {
        acc[widget.id] = widget;
        return acc;
      }, {} as { [id: number]: Widget }),
    })),
  addWidget: (widget: Widget) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [widget.id]: widget,
      },
    })),
  updateWidget: (id: number, params: WidgetParams) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          params,
        },
      },
    })),
  removeWidget: (id: number) =>
    set((state) => ({
      widgets: Object.fromEntries(
        Object.entries(state.widgets).filter(([key]) => key !== String(id))
      ),
    })),
  updateWidgetType: (id: number, type: WidgetType) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          type,
        },
      },
    })),
}));
