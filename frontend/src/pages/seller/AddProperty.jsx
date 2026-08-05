import React, { useState } from 'react';
import { sellerLayoutStyles as ls, adminDashboardStyles as ds } from '../../assets/dummyStyles';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiCloudUpload, HiX } from 'react-icons/hi';

const AddProperty = () => {
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
        amenities: ''
    });
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setPreview([...preview, ...previews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreview(preview.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Please upload at least one property image.");
            return;
        }

        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(image => data.append('images', image));

        try {
            await axios.post(`${API_URL.replace(/\/$/, '')}/api/property`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/seller/properties');
        } catch (error) {
            console.error("Failed to add property", error);
            alert(error.response?.data?.message || "Failed to add property");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={ls.container}>
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.contentWrapper}>
                <main className={ls.main}>
                    <SellerHeader setSidebarOpen={setSidebarOpen} title="List New Property" subtitle="Fill in the details to reach thousands of buyers" />

                    <form onSubmit={handleSubmit} className="card-premium p-8 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Title</label>
                                <input type="text" name="title" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="e.g. Modern 3BHK Apartment in Downtown" required onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Description</label>
                                <textarea name="description" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary min-h-[120px]" placeholder="Tell buyers about the unique features of your property..." required onChange={handleChange}></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Price ($)</label>
                                <input type="number" name="price" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="Total Price" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Type</label>
                                <select name="propertyType" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary bg-white" onChange={handleChange}>
                                    <option value="flat">Flat/Apartment</option>
                                    <option value="villa">Villa/House</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">City</label>
                                <input type="text" name="city" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="City" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Area / Locality</label>
                                <input type="text" name="area" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="e.g. Manhattan" required onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Pincode</label>
                                <input type="text" name="pincode" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="Pincode" required onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-3 gap-3 md:col-span-1">
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">BHK</label>
                                    <input type="text" name="bhk" className="w-full p-3 rounded-xl border border-border" placeholder="3" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">Baths</label>
                                    <input type="number" name="bathrooms" className="w-full p-3 rounded-xl border border-border" placeholder="2" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase">Sq.Ft</label>
                                    <input type="number" name="areaSize" className="w-full p-3 rounded-xl border border-border" placeholder="1200" onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Furnishing</label>
                                <select name="furnishing" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary bg-white" onChange={handleChange}>
                                    <option value="unfurnished">Unfurnished</option>
                                    <option value="semi-furnished">Semi-Furnished</option>
                                    <option value="furnished">Furnished</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Amenities (Comma separated)</label>
                                <input type="text" name="amenities" className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary" placeholder="e.g. Gym, Pool, Parking, Security" onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Property Images (Required)</label>
                                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors relative cursor-pointer group">
                                    <input type="file" multiple required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                                    <HiCloudUpload className="text-4xl text-text-muted group-hover:text-primary mb-2 mx-auto" />
                                    <p className="text-sm font-bold">Click or drag images to upload</p>
                                    <p className="text-xs text-text-muted">Maximum 10 images. PNG, JPG allowed.</p>
                                </div>
                                
                                {preview.length > 0 && (
                                    <div className="flex gap-4 mt-6 overflow-x-auto pb-4">
                                        {preview.map((src, index) => (
                                            <div key={index} className="relative shrink-0">
                                                <img src={src} className="w-24 h-24 object-cover rounded-xl border border-border" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
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
                            <button type="submit" className="btn btn-primary flex-1 py-4 text-lg" disabled={loading}>
                                {loading ? 'Listing Property...' : 'List Property Now'}
                            </button>
                            <button type="button" className="btn btn-outline px-8" onClick={() => navigate('/seller/properties')}>Cancel</button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AddProperty;
