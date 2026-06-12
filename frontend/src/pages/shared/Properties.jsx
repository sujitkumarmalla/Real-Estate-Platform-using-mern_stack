import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import PropertyCard from '../../components/PropertyCard';
import { propertiesStyles as s } from '../../assets/dummyStyles';
import { HiAdjustments, HiSearch, HiX, HiFilter } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Properties = () => {
    const { user, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filters state
    const [filters, setFilters] = useState({
        city: queryParams.get('city') || '',
        type: queryParams.get('type') || '',
        minPrice: queryParams.get('minPrice') || '',
        maxPrice: queryParams.get('maxPrice') || '',
        bhk: queryParams.get('bhk') || '',
        furnishing: queryParams.get('furnishing') || '',
    });

    useEffect(() => {
        fetchProperties();
        if (user) {
            fetchWishlist();
        }
    }, [location.search, user]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/property${location.search}`);
            setProperties(res.data.properties || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
            setError("Failed to load properties. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistedIds(
                res.data.data?.map(item => String(item.property?._id || item.property)) || []
            );
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const handleToggleWishlist = async (propertyId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const isWishlisted = wishlistedIds.includes(String(propertyId));
            if (isWishlisted) {
                await axios.delete(`${API_URL.replace(/\/$/, '')}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistedIds(prev => prev.filter(id => id !== String(propertyId)));
            } else {
                await axios.post(`${API_URL.replace(/\/$/, '')}/api/wishlist/${propertyId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistedIds(prev => [...prev, String(propertyId)]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        navigate(`/properties?${params.toString()}`);
        setMobileFiltersOpen(false);
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            type: '',
            minPrice: '',
            maxPrice: '',
            bhk: '',
            furnishing: '',
        });
        navigate('/properties');
        setMobileFiltersOpen(false);
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />
            
            <main className={s.container}>
                <div className={s.mobileFilterButtonWrapper}>
                    <button 
                        className={s.mobileFilterButton}
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <HiFilter /> Show Filters
                    </button>
                </div>

                <div className={s.layout}>
                    {/* Sidebar Filters */}
                    <aside className={`${s.sidebar} ${mobileFiltersOpen ? s.sidebarVisible : s.sidebarHidden}`}>
                        <div className={s.sidebarHeader}>
                            <div className={s.sidebarTitleWrapper}>
                                <HiAdjustments className={s.sidebarTitleIcon} size={24} />
                                <h2 className={s.sidebarTitle}>Filters</h2>
                            </div>
                            <div className={s.sidebarHeaderActions}>
                                <button className={s.resetButton} onClick={resetFilters}>Reset</button>
                                <button 
                                    className={s.closeMobileFilters}
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    <HiX size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={applyFilters} className={s.filtersScrollArea}>
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Search Location</label>
                                <div className={s.searchInputWrapper}>
                                    <HiSearch className={s.searchIcon} />
                                    <input 
                                        type="text" 
                                        name="city"
                                        placeholder="City or area..."
                                        className={s.searchInput}
                                        value={filters.city}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Property Type</label>
                                <select 
                                    name="type" 
                                    className={s.sortSelect + " w-full"}
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Types</option>
                                    <option value="flat">Flat/Apartment</option>
                                    <option value="villa">Villa/House</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>

                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>BHK</label>
                                <div className={s.bhkGroup}>
                                    {['1', '2', '3', '4', '5+'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`${s.bhkButton} ${filters.bhk === val ? s.bhkButtonActive : s.bhkButtonInactive}`}
                                            onClick={() => setFilters(prev => ({ ...prev, bhk: prev.bhk === val ? '' : val }))}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Furnishing</label>
                                <select 
                                    name="furnishing" 
                                    className={s.sortSelect + " w-full"}
                                    value={filters.furnishing}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any</option>
                                    <option value="furnished">Furnished</option>
                                    <option value="semi-furnished">Semi-Furnished</option>
                                    <option value="unfurnished">Unfurnished</option>
                                </select>
                            </div>

                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Price Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="number" 
                                        name="minPrice"
                                        placeholder="Min"
                                        className={s.searchInput}
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                    />
                                    <input 
                                        type="number" 
                                        name="maxPrice"
                                        placeholder="Max"
                                        className={s.searchInput}
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={s.emptyButton + " w-full mt-4"}>
                                Apply Filters
                            </button>
                        </form>
                    </aside>

                    {/* Main Content */}
                    <div className={s.mainContent}>
                        <div className={s.contentHeader}>
                            <p className={s.resultCount}>
                                Showing <span className={s.resultCountStrong}>{properties.length}</span> properties
                            </p>
                            <div className={s.headerControls}>
                                {/* Sorting could be added here */}
                            </div>
                        </div>

                        {loading ? (
                            <div className={s.skeletonGrid}>
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className={s.skeletonCard + " animate-pulse bg-gray-200"}></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className={s.errorContainer}>
                                <p className={s.errorTitle}>{error}</p>
                                <button className={s.errorButton} onClick={fetchProperties}>Try Again</button>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className={s.emptyContainer}>
                                <div className={s.emptyIconWrapper}>
                                    <HiSearch size={40} className={s.emptyIcon} />
                                </div>
                                <h2 className={s.emptyTitle}>No Properties Found</h2>
                                <p className={s.emptyText}>We couldn't find any properties matching your criteria. Try adjusting your filters.</p>
                                <button className={s.emptyButton} onClick={resetFilters}>Clear All Filters</button>
                            </div>
                        ) : (
                            <div className={s.propertyList + " " + s.propertyListGrid}>
                                {properties.map(property => (
                                    <PropertyCard 
                                        key={property._id} 
                                        property={property} 
                                        isWishlisted={wishlistedIds.includes(String(property._id))}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {mobileFiltersOpen && <div className={s.mobileOverlay} onClick={() => setMobileFiltersOpen(false)}></div>}
            <Footer />
        </div>
    );
};

export default Properties;
