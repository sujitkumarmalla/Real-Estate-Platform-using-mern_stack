import React, { useEffect, useState } from 'react';
import { sellerLayoutStyles as ls, adminDashboardStyles as ds } from '../../assets/dummyStyles';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { HiCloudUpload, HiX, HiSave } from 'react-icons/hi';

const EditProperty = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: '',
        area: '',
        pincode: '',
        propertyType: 'flat',
        bhk: '',
        bathrooms: '',
        areaSize: '',
        furnishing: 'unfurnished',
        amenities: '',
        status: 'sale'
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/property/${id}`);
                const p = res.data.property;
                setFormData({
                    title: p.title || '',
                    description: p.description || '',
                    price: p.price || '',
                    city: p.city || '',
                    area: p.area || '',
                    pincode: p.pincode || '',
                    propertyType: p.propertyType || 'flat',
                    bhk: p.bhk || '',
                    bathrooms: p.bathrooms || '',
                    areaSize: p.areaSize || '',
                    furnishing: p.furnishing || 'unfurnished',
                    amenities: Array.isArray(p.amenities) ? p.amenities.join(', ') : p.amenities || '',
                    status: p.status || 'sale'
                });
                setExistingImages(p.images || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch property", error);
                alert("Property not found or unauthorized");
                navigate('/seller/properties');
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages([...newImages, ...files]);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setPreview([...preview, ...previews]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setPreview(preview.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (existingImages.length === 0 && newImages.length === 0) {
            alert("Please upload at least one property image.");
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('existingImages', JSON.stringify(existingImages));
        newImages.forEach(image => data.append('images', image));

        try {
            await axios.put(`${API_URL.replace(/\/$/, '')}/api/property/${id}`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/seller/properties');
        } catch (error) {
            console.error("Failed to update property", error);
            alert(error.response?.data?.message || "Failed to update property");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.container}>
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.contentWrapper}>
                <main className={ls.main}>
                    <SellerHeader setSidebarOpen={setSidebarOpen} title="Edit Property" subtitle="Update your listing details" />

                    <form onSubmit={handleSubmit} className="card-premium p-8 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Title</label>
                                <input type="text" name="title" value={formData.title} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="e.g. Modern 3BHK Apartment" required onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Description</label>
                                <textarea name="description" value={formData.description} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary min-h-[120px]" placeholder="Tell buyers about your property..." required onChange={handleChange}></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Price ($)</label>
                                <input type="number" name="price" value={formData.price} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Type</label>
                                <select name="propertyType" value={formData.propertyType} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary bg-white" onChange={handleChange}>
                                    <option value="flat">Flat/Apartment</option>
                                    <option value="villa">Villa/House</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">City</label>
                                <input type="text" name="city" value={formData.city} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Area / Locality</label>
                                <input type="text" name="area" value={formData.area} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Pincode</label>
                                <input type="text" name="pincode" value={formData.pincode} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" required onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">BHK</label>
                                    <input type="text" name="bhk" value={formData.bhk} className="w-full p-3 rounded-xl border border-border" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">Baths</label>
                                    <input type="number" name="bathrooms" value={formData.bathrooms} className="w-full p-3 rounded-xl border border-border" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">Sq.Ft</label>
                                    <input type="number" name="areaSize" value={formData.areaSize} className="w-full p-3 rounded-xl border border-border" onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Furnishing</label>
                                <select name="furnishing" value={formData.furnishing} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary bg-white" onChange={handleChange}>
                                    <option value="unfurnished">Unfurnished</option>
                                    <option value="semi-furnished">Semi-Furnished</option>
                                    <option value="furnished">Furnished</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Status</label>
                                <select name="status" value={formData.status} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary bg-white" onChange={handleChange}>
                                    <option value="sale">For Sale</option>
                                    <option value="sold">Sold Out</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Amenities (Comma separated)</label>
                                <input type="text" name="amenities" value={formData.amenities} className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="e.g. Gym, Pool, Parking" onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Images</label>
                                
                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-widest">Current Images</p>
                                        <div className="flex gap-4 overflow-x-auto pb-2">
                                            {existingImages.map((src, index) => (
                                                <div key={index} className="relative shrink-0">
                                                    <img src={src} className="w-20 h-20 object-cover rounded-lg border border-border" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                                                    >
                                                        <HiX size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors relative cursor-pointer group">
                                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                                    <HiCloudUpload className="text-4xl text-text-muted group-hover:text-primary mb-2 mx-auto" />
                                    <p className="text-sm font-bold">Upload New Images</p>
                                </div>
                                
                                {preview.length > 0 && (
                                    <div className="flex gap-4 mt-6 overflow-x-auto pb-4">
                                        {preview.map((src, index) => (
                                            <div key={index} className="relative shrink-0">
                                                <img src={src} className="w-24 h-24 object-cover rounded-xl border border-border ring-2 ring-primary ring-offset-2" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <HiX size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="submit" className="btn btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-2" disabled={submitting}>
                                <HiSave /> {submitting ? 'Updating...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-outline px-8" onClick={() => navigate('/seller/properties')}>Cancel</button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProperty;
