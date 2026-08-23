import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const FailedDeliveryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark as Failed">
      <div className="space-y-4">
        <p>Please select a failure reason.</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};
