import { ReactNode } from 'react';
import { Dialog, DialogOverlay, DialogContent } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, description, children }: ModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Overlay */}
            <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />

            {/* Modal Content */}
            <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Body */}
                    <div className="p-4 space-y-4">
                        {description && <p className="text-gray-600">{description}</p>}
                        {children}
                    </div>
                    {/* Footer */}
                    <div className="flex justify-end px-4 py-3 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};