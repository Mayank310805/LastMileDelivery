import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const FailedDeliveryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark as Failed">
      <div className="space-y-5 mt-2">
        <p className="text-surface-700 text-base">Please select a failure reason to proceed with marking this delivery as failed.</p>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-200">
          <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
          <Button variant="danger" onClick={onClose} className="px-6">Submit</Button>
        </div>
      </div>
    </Modal>
  );
};

