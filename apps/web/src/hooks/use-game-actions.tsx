import { create } from 'zustand';

import { useGameTasks } from './use-game-tasks';

import type { Game, InteractionType } from '~/types/game';

interface GameStore {
  isTaskDialogOpen: boolean;
  isChatOpen: boolean;
  taskType: InteractionType | null;
  setIsTaskDialogOpen: (isTaskDialogOpen: boolean) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  setTaskType: (taskType: InteractionType | null) => void;
}

const useGameStore = create<GameStore>((set) => ({
  isTaskDialogOpen: false,
  isChatOpen: false,
  taskType: null,
  setIsTaskDialogOpen: (isTaskDialogOpen) => set({ isTaskDialogOpen }),
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
  setTaskType: (taskType) => set({ taskType }),
}));

export const useGameActions = (game: Game) => {
  const store = useGameStore();
  const { chooseRandomTask } = useGameTasks(game);

  const aiCompletedTasks =
    game.players.find(
      (p) => p.address === import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS
    )?.tasksCompleted ?? [];

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
    chooseRandomTask,
    aiCompletedTasks,
  };
};

export type GameActions = ReturnType<typeof useGameActions>;
