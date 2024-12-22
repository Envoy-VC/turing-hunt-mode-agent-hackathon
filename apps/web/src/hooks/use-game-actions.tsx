import { create } from 'zustand';

import type { InteractionType } from '~/types/game';

interface GameStore {
  isTaskDialogOpen: boolean;
  taskType: InteractionType | null;
  setIsTaskDialogOpen: (isTaskDialogOpen: boolean) => void;
  setTaskType: (taskType: InteractionType | null) => void;
}

const useGameStore = create<GameStore>((set) => ({
  isTaskDialogOpen: true,
  taskType: 'fireplace',
  setIsTaskDialogOpen: (isTaskDialogOpen) => set({ isTaskDialogOpen }),
  setTaskType: (taskType) => set({ taskType }),
}));

export const useGameActions = () => {
  const store = useGameStore();

  const startTask = (taskType: InteractionType) => {
    store.setIsTaskDialogOpen(true);
    store.setTaskType(taskType);
  };

  const onCloseTaskDialog = () => {
    store.setIsTaskDialogOpen(false);
    store.setTaskType(null);
  };

  return {
    store,
    startTask,
    onCloseTaskDialog,
  };
};

export type GameActions = ReturnType<typeof useGameActions>;
