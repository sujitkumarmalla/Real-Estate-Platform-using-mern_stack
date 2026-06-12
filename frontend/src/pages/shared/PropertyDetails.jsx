import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import PropertyCard from '../../components/PropertyCard';
import { propertyDetailsStyles as s } from '../../assets/dummyStyles';
import { HiLocationMarker, HiHome, HiViewGrid, HiPhone, HiChatAlt2, HiCheckCircle, HiArrowLeft, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [inquiryMessage, setInquiryMessage] = useState("I am interested in this property. Please provide more details.");
    const [inquiryLoading, setInquiryLoading] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPropertyDetails();
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/property/${id}`);
            setProperty(res.data.property);
            setSimilarProperties(res.data.similarProperty || []);
            
            // Check if wishlisted if user logged in
            if (user) {
                const wishlistRes = await axios.get(`${API_URL.replace(/\/$/, '')}/api/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const wishlistedIds = wishlistRes.data.data?.map(item => String(item.property?._id || item.property)) || [];
                setIsWishlisted(wishlistedIds.includes(String(id)));
            }
            
            setError(null);
        } catch (err) {
            console.error("Failed to fetch property details:", err);
            setError("Property not found or failed to load.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            if (isWishlisted) {
                await axios.delete(`${API_URL.replace(/\/$/, '')}/api/wishlist/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsWishlisted(false);
            } else {
                await axios.post(`${API_URL.replace(/\/$/, '')}/api/wishlist/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleSendInquiry = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            setInquiryLoading(true);
            await axios.post(`${API_URL.replace(/\/$/, '')}/api/inquiry`, {
                propertyId: id,
                message: inquiryMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInquirySuccess(true);
            setInquiryMessage("");
        } catch (err) {
            console.error("Failed to send inquiry:", err);
            alert("Failed to send inquiry. Please try again.");
        } finally {
            setInquiryLoading(false);
        }
    };

    const handleStartChat = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/chat/start`, {
                propertyId: id,
                sellerId: property.seller._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/chat?id=${res.data._id}`);
        } catch (err) {
            console.error("Failed to start chat:", err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="loader"></div>
        </div>
    );

    if (error || !property) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">{error || "Property not found"}</h2>
            <button className="btn btn-primary" onClick={() => navigate('/properties')}>Back to Properties</button>
        </div>
    );

    const images = property.images && property.images.length > 0 ? property.images : ["https://placehold.co/800x600?text=No+Image"];

    return (
        <div className={s.pageContainer}>
            <Navbar />
            
            <main className={s.mainContainer}>
                {/* Breadcrumbs */}
                <div className={s.breadcrumbs}>
                    <Link to="/" className={s.breadcrumbLink}>Home</Link>
                    <span>/</span>
                    <Link to="/properties" className={s.breadcrumbLink}>Properties</Link>
                    <span>/</span>
                    <span className={s.breadcrumbCurrent}>{property.title}</span>
                </div>

                {/* Gallery */}
                <div className={s.galleryContainer}>
                    <div className={s.galleryGrid}>
                        <div className={s.galleryMainItem(images.length > 1)}>
                            <img src={images[mainImage]} className={s.galleryImage} alt={property.title} />
                        </div>
                        {images.slice(1, 5).map((img, idx) => (
                            <div key={idx} className={s.gallerySideItem} onClick={() => setMainImage(idx + 1)}>
                                <img src={img} className={s.galleryImage} alt={`${property.title} ${idx + 1}`} />
                                {idx === 3 && images.length > 5 && (
                                    <div className={s.galleryMoreOverlay}>+{images.length - 5} More</div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Mobile Slider would go here - simplified for now */}
                    <div className="md:hidden">
                        <img src={images[0]} className="w-full aspect-video object-cover rounded-2xl" alt={property.title} />
                    </div>
                </div>

                {/* Main Details Layout */}
                <div className={s.detailsLayout}>
                    {/* Left Column: Info */}
                    <div className={s.infoColumn}>
                        <div className={s.infoHeader}>
                            <div className="flex justify-between items-start gap-4">
                                <div className={s.titleWrapper}>
                                    <div className={s.badgeWrapper}>
                                        <span className={s.premiumBadge}>{property.propertyType}</span>
                                        <span className={`${s.premiumBadge} border-green-500 text-green-500`}>For {property.status}</span>
                                    </div>
                                    <h1 className={s.propertyTitle}>{property.title}</h1>
                                    <p className={s.propertyLocation}>
                                        <HiLocationMarker className={s.locationIcon} />
                                        <span className={s.locationText}>{property.area}, {property.city} - {property.pincode}</span>
                                    </p>
                                </div>
                                <div className={s.actionButtons}>
                                    <button 
                                        className={s.wishlistButton(isWishlisted)}
                                        onClick={handleToggleWishlist}
                                    >
                                        {isWishlisted ? <HiHeart size={24} /> : <HiOutlineHeart size={24} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className={s.statsGrid}>
                            <div className={s.statCard}>
                                <HiHome className={s.statIcon} size={20} />
                                <p className={s.statValue}>{property.bhk} BHK</p>
                                <p className={s.statLabel}>Bedrooms</p>
                            </div>
                            <div className={s.statCard}>
                                <HiViewGrid className={s.statIcon} size={20} />
                                <p className={s.statValue}>{property.areaSize} sq.ft</p>
                                <p className={s.statLabel}>Total Area</p>
                            </div>
                            <div className={s.statCard}>
                                <HiHome className={s.statIcon} size={20} />
                                <p className={s.statValue}>{property.furnishing}</p>
                                <p className={s.statLabel}>Furnishing</p>
                            </div>
                            <div className={s.statCard}>
                                <HiHome className={s.statIcon} size={20} />
                                <p className={s.statValue}>{property.bathrooms}</p>
                                <p className={s.statLabel}>Bathrooms</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={s.descriptionSection}>
                            <h2 className={s.sectionTitle}>About this property</h2>
                            <p className={s.descriptionText}>{property.description}</p>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className={s.amenitiesSection}>
                                <h2 className={s.sectionTitle}>Amenities</h2>
                                <div className={s.amenitiesGrid}>
                                    {property.amenities.map((amenity, idx) => (
                                        <div key={idx} className={s.amenityItem}>
                                            <HiCheckCircle className={s.amenityIcon} size={18} />
                                            <span className={s.amenityText}>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className={s.sidebarColumn}>
                        <div className={`${s.priceCard} bg-primary`}>
                            <p className={s.priceCardLabel}>Property Price</p>
                            <h2 className={s.priceCardValue}>₹{property.price?.toLocaleString()}</h2>
                            <p className={s.priceCardAvailability}>Available for Immediate Purchase</p>
                        </div>

                        <div className={s.sellerCard}>
                            <div className={s.sellerInfo}>
                                <div className={s.sellerAvatar}>
                                    <img 
                                        src={property.seller?.profilePic || `https://ui-avatars.com/api/?name=${property.seller?.name}&background=0d6e59&color=fff`} 
                                        className={s.sellerAvatarImage} 
                                        alt={property.seller?.name} 
                                    />
                                </div>
                                <div className={s.sellerDetails}>
                                    <h3 className={s.sellerName}>{property.seller?.name}</h3>
                                    <div className={s.sellerVerifiedBadge}>
                                        <HiCheckCircle className={s.verifiedIcon} />
                                        <span>Verified Seller</span>
                                    </div>
                                </div>
                            </div>

                            <div className={s.chatButtonWrapper}>
                                <button className={s.chatButton} onClick={handleStartChat}>
                                    <HiChatAlt2 /> Chat with Seller
                                </button>
                                <a href={`tel:${property.seller?.phone}`} className={s.chatButton}>
                                    <HiPhone /> Call
                                </a>
                            </div>

                            {inquirySuccess ? (
                                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                                    <HiCheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                                    <p className="text-green-700 font-bold">Inquiry Sent!</p>
                                    <p className="text-green-600 text-sm">The seller will contact you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendInquiry}>
                                    <h4 className={s.inquiryFormTitle}>Send an Inquiry</h4>
                                    <textarea 
                                        className={s.inquiryTextarea}
                                        value={inquiryMessage}
                                        onChange={(e) => setInquiryMessage(e.target.value)}
                                        placeholder="Write your message here..."
                                        required
                                    ></textarea>
                                    <button 
                                        type="submit" 
                                        className={s.inquirySubmitButton}
                                        disabled={inquiryLoading}
                                    >
                                        {inquiryLoading ? "Sending..." : "Send Inquiry"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Similar Properties */}
                {similarProperties.length > 0 && (
                    <section className={s.similarSection}>
                        <div className={s.similarHeader}>
                            <div>
                                <h2 className={s.similarTitle}>Similar Properties</h2>
                                <p className={s.similarSubtitle}>You might also be interested in these listings in {property.city}.</p>
                            </div>
                            <button className={s.similarAllLink} onClick={() => navigate(`/properties?city=${property.city}`)}>
                                View All
                            </button>
                        </div>
                        <div className={s.similarGrid}>
                            {similarProperties.map(prop => (
                                <PropertyCard key={prop._id} property={prop} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PropertyDetails;
