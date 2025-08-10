import { create } from "zustand";
import type { Widget, WidgetParams, WidgetType } from "./types";

interface WidgetDictionary {
  [id: number]: Widget;
}

interface HistoryState {
  past: WidgetDictionary[];
  future: WidgetDictionary[];
  isRecording: boolean; // флаг, что мы в процессе одной операции
}

export interface StoreState extends HistoryState {
  widgets: WidgetDictionary;
  isActive: boolean; // флаг, что можно менять виджеты
  setIsActive: (isActive: boolean) => void;
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (
    id: number,
    params: WidgetParams,
    recordHistory?: boolean
  ) => void;
  removeWidget: (id: number) => void;
  updateWidgetType: (id: number, type: WidgetType) => void;
  startHistoryGroup: () => void;
  endHistoryGroup: () => void;
  undo: () => void;
  redo: () => void;
}

export const useWidgetStore = create<StoreState>((set, get) => ({
  widgets: {},
  past: [],
  future: [],
  isRecording: false,
  isActive: true,
  setIsActive: (isActive) => set({ isActive }),

  setWidgets: (widgets: Widget[]) =>
    set(() => ({
      widgets: widgets.reduce((acc, widget) => {
        acc[widget.id] = widget;
        return acc;
      }, {} as WidgetDictionary),
      past: [],
      future: [],
    })),

  addWidget: (widget) => {
    const { widgets, past } = get();
    set({
      past: [...past, widgets],
      future: [],
      widgets: { ...widgets, [widget.id]: widget },
    });
  },

  updateWidget: (id, params, recordHistory = true) => {
    const { widgets, past, isRecording, setIsActive } = get();

    // Пишем в историю, только если:
    // - recordHistory === true (по умолчанию)
    // - и это не внутри одной группы
    if (recordHistory && !isRecording) {
      setIsActive(false); // пересчелкиваем активность при обновлении - багфикс

      set({
        past: [...past, widgets],
        future: [],
      });
      setTimeout(() => {
        setIsActive(true); // пересчелкиваем активность при обновлении - багфикс
      }, 1); // используем setTimeout для асинхронного обновления состояния
    }

    set({
      widgets: {
        ...widgets,
        [id]: {
          ...widgets[id],
          params,
        },
      },
    });
    // // setIsActive(false); // пересчелкиваем активность при обновлении - багфикс
  },

  removeWidget: (id) => {
    const { widgets, past } = get();
    const newWidgets = Object.fromEntries(
      Object.entries(widgets).filter(([key]) => key !== String(id))
    );
    set({
      past: [...past, widgets],
      future: [],
      widgets: newWidgets,
    });
  },

  updateWidgetType: (id, type) => {
    const { widgets, past } = get();
    set({
      past: [...past, widgets],
      future: [],
      widgets: {
        ...widgets,
        [id]: {
          ...widgets[id],
          type,
        },
      },
    });
  },

  startHistoryGroup: () => {
    const { widgets, past } = get();
    // Сохраняем текущее состояние в историю и отмечаем, что мы внутри группы
    set({
      past: [...past, widgets],
      future: [],
      isRecording: true,
    });
  },

  endHistoryGroup: () => {
    set({ isRecording: false });
  },

  undo: () => {
    const { past, widgets, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    set({
      past: newPast,
      future: [widgets, ...future],
      widgets: previous,
    });
  },

  redo: () => {
    const { past, widgets, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, widgets],
      future: newFuture,
      widgets: next,
    });
  },
}));
