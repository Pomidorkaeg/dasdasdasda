import React from 'react';
import { Player } from '@/types/models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeletePlayerDialogProps {
  player: Player | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePlayerDialog: React.FC<DeletePlayerDialogProps> = ({
  player,
  onClose,
  onConfirm,
}) => {
  if (!player) return null;

  return (
    <Dialog open={!!player} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удаление игрока</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить игрока {player.name}? Это действие нельзя отменить.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 