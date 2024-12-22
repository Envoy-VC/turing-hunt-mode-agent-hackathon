import { Dialog, DialogContent } from '~/components/ui/dialog';

import { FireplaceTask, TelevisionTask } from './tasks';

import type { InteractionType } from '~/types/game';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interactionType: InteractionType | null;
}

export const TaskDialog = ({
  open,
  onOpenChange,
  interactionType,
}: TaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-md !rounded-3xl border-none bg-gray-800 p-8 text-white shadow-lg'>
        {interactionType === 'fireplace' && <FireplaceTask />}
        {interactionType === 'television-set' && <TelevisionTask />}
      </DialogContent>
    </Dialog>
  );
};
