import React, { useState, useEffect } from 'react';
import returnApi from '../../../services/returnApi';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { resolveImageUrl } from '../../../lib/resolveImageUrl';

const ReturnManagement = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const response = await returnApi.getAllReturns();
            setReturns(response.data);
        } catch (error) {
            console.error('Error fetching returns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        setProcessingId(id);
        try {
            await returnApi.updateReturnStatus(id, status);
            await fetchReturns();
            if (selectedReturn?.id === id) {
                setSelectedReturn(null);
            }
        } catch (error) {
            console.error('Error updating return status:', error);
            alert('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading return requests...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Return Requests ({returns.length})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {returns.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{req.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.userEmail}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                req.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                                    req.status === 'RE_DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedReturn(req)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {returns.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No return requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedReturn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900 font-sans">Return Request Details - #{selectedReturn.orderId}</h2>
                            <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="X" size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Customer</h3>
                                        <p className="text-lg font-medium">{selectedReturn.userEmail}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Reason</h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedReturn.reason}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Current Status</h3>
                                        <span className={`inline-block px-3 py-1 mt-1 text-sm font-semibold rounded-full ${selectedReturn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedReturn.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                                    selectedReturn.status === 'RE_DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedReturn.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Product Image</h3>
                                    {selectedReturn.imageUrl ? (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={resolveImageUrl(selectedReturn.imageUrl)}
                                                alt="Product return"
                                                className="w-full h-auto object-contain max-h-[300px]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                                            <Icon name="Image" size={48} className="mb-2 opacity-20" />
                                            <p>No image uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Action Required</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        onClick={() => handleUpdateStatus(selectedReturn.id, 'APPROVED')}
                                        disabled={processingId === selectedReturn.id || selectedReturn.status === 'APPROVED'}
                                        variant="outline"
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                    >
                                        Approve Return
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateStatus(selectedReturn.id, 'RE_DELIVERED')}
                                        disabled={processingId === selectedReturn.id || selectedReturn.status === 'RE_DELIVERED'}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Mark as Re-delivered
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateStatus(selectedReturn.id, 'REJECTED')}
                                        disabled={processingId === selectedReturn.id || selectedReturn.status === 'REJECTED'}
                                        variant="destructive"
                                    >
                                        Reject Return
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnManagement;
