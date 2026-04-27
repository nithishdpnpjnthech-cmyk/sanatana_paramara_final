import React, { useEffect, useState, useRef } from 'react';
import productApi from '../../../services/productApi';
import resolveImageUrl from '../../../lib/resolveImageUrl';

const UpdateProductImage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getAll();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setImageFile(null);
  };

  const handleRemoveImage = async (productId, imageUrl) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    try {
      await productApi.removeImage(productId);
      // Refresh product list and modal
      const updated = await productApi.getById(productId);
      setEditingProduct(updated);
      setProducts(products => products.map(p => p.id === productId ? updated : p));
    } catch (err) {
      alert('Failed to remove image: ' + (err.message || err));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    try {
      await productApi.uploadImage(editingProduct.id, file);
      // Refresh product list and modal
      const updated = await productApi.getById(editingProduct.id);
      setEditingProduct(updated);
      setProducts(products => products.map(p => p.id === editingProduct.id ? updated : p));
      alert('Image uploaded successfully!');
    } catch (err) {
      alert('Failed to upload image: ' + (err.message || err));
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Update Product Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center">
            <img
              src={resolveImageUrl(product.imageUrl || product.image)}
              alt={product.name}
              className="w-32 h-32 object-cover rounded mb-2 border"
              onError={e => { e.currentTarget.src = '/assets/images/no_image.png'; }}
            />
            <div className="font-bold mb-2 text-center">{product.name}</div>
            <button
              className="px-3 py-1 bg-primary text-primary-foreground rounded mb-2"
              onClick={() => handleEditClick(product)}
            >
              Edit Images
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setEditingProduct(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">Edit Images for {editingProduct.name}</h2>
            <div className="space-y-2 mb-4">
              {/* Show current image */}
              <img
                src={resolveImageUrl(editingProduct.imageUrl || editingProduct.image)}
                alt={editingProduct.name}
                className="w-32 h-32 object-cover rounded border mb-2"
                onError={e => { e.currentTarget.src = '/assets/images/no_image.png'; }}
              />
              <button
                className="text-destructive text-xs mb-2"
                onClick={() => handleRemoveImage(editingProduct.id, editingProduct.imageUrl || editingProduct.image)}
              >
                Remove Image
              </button>
            </div>
            <div className="mb-4">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} />
              {imageFile && <div className="mt-2 text-xs">Selected: {imageFile.name}</div>}
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={() => setEditingProduct(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProductImage;
