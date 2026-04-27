import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import returnApi from '../../../services/returnApi';
import { useAuth } from '../../../contexts/AuthContext';

const ReturnRequestModal = ({ order, isOpen, onClose, onRefresh }) => {
    const { user } = useAuth();
    const [reason, setReason] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError('Please provide a reason for the return.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('orderId', order.id);
        formData.append('email', user.email);
        formData.append('reason', reason);
        if (image) {
            formData.append('image', image);
        }

        try {
            await returnApi.submitReturn(formData);
            onRefresh();
            onClose();
        } catch (err) {
            console.error('Error submitting return:', err);
            setError(err.response?.data?.error || 'Failed to submit return request.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-heading font-bold text-foreground font-sans">Request Return - Order #{order.id}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <Icon name="X" size={24} className="text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Reason for Return</label>
                        <textarea
                            className="w-full border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none min-h-[120px]"
                            placeholder="Please explain why you want to return this product..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Upload Product Image</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {preview ? (
                                <div className="relative w-full h-64 border rounded overflow-hidden bg-muted/30">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-transform hover:scale-110"
                                    >
                                        <Icon name="X" size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (High quality supported)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="default" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnRequestModal;
