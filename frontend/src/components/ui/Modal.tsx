import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      
      <div className="modal-content relative animate-scale-in">
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 transition-colors rounded-full p-1 hover:bg-surface-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
