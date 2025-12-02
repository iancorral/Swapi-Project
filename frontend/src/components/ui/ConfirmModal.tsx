import React from 'react';

interface Props {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({ open, message, onConfirm, onCancel }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

            <div className="relative bg-white rounded-lg shadow-2xl w-11/12 sm:w-96 mx-4 p-6 z-10">
                <p className="text-gray-800 text-base mb-4">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
