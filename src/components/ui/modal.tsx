import { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
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
            <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                        {description && <Dialog.Description className="text-gray-600">{description}</Dialog.Description>}
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
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};