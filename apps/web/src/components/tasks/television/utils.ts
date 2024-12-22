export interface Wire {
  id: number;
  color: string;
  isConnected: boolean;
  startY: number;
  endY: number | null;
  correctEndY: number;
}

export interface GameState {
  wires: Wire[];
  selectedWire: number | null;
  isSolved: boolean;
  dragEndY: number | null;
  isChecked: boolean;
}

export function generateWires(): Wire[] {
  const colors = ['red', 'blue', 'yellow'];
  const shuffledStartPositions = [...Array<number>(colors.length)]
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);
  const shuffledEndPositions = [...Array<number>(colors.length)]
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);

  return colors.map((color, index) => ({
    id: index,
    color,
    isConnected: false,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- shuffledStartPositions is not null
    startY: shuffledStartPositions[index]! * 25 + 12.5,
    endY: null,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- shuffledEndPositions is not null
    correctEndY: shuffledEndPositions[index]! * 25 + 12.5,
  }));
}

export function checkSolution(wires: Wire[]): boolean {
  return wires.every(
    (wire) => wire.isConnected && (wire.endY ?? 0) - wire.correctEndY < 5
  );
}

export function connectWire(
  state: GameState,
  wireId: number,
  endY: number
): GameState {
  const { wires, selectedWire } = state;

  if (selectedWire === null) {
    return state;
  }

  const updatedWires = wires.map((wire) =>
    wire.id === selectedWire ? { ...wire, isConnected: true, endY } : wire
  );

  return {
    ...state,
    wires: updatedWires,
    selectedWire: null,
    dragEndY: null,
    isChecked: false,
  };
}
