import React from 'react';
import { Link } from 'react-router-dom';
import { propertyCardStyles as s } from '../assets/dummyStyles';
import { HiOutlineLocationMarker, HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { FaBed, FaBath, FaVectorSquare } from 'react-icons/fa';

const PropertyCard = ({ property, isWishlisted, onToggleWishlist }) => {
    if (!property) return null;

    return (
        <div className={s.card}>
            <div className={s.imageSection}>
                <Link to={`/property/${property._id}`} className={s.link}>
                    <img 
                        src={(property.images && property.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={property.title || 'Property'} 
                        className={s.image}
                    />
                </Link>
                <div className={s.topBadges}>
                    <div className={s.badgesLeft}>
                        {property.status && (
                            <span className={s.badgeStatus(property.status)}>
                                {property.status}
                            </span>
                        )}
                        {property.isVerified && (
                            <span className={s.badgeVerified}>Verified</span>
                        )}
                    </div>
                    <button 
                        className={s.wishlistButton ? s.wishlistButton(isWishlisted) : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleWishlist && onToggleWishlist(property._id);
                        }}
                    >
                        {isWishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                    </button>
                </div>
                <div className={s.priceOverlay}>
                    <p className={s.price}>${property.price ? property.price.toLocaleString() : '0'}</p>
                </div>
            </div>

            <div className={s.content}>
                <span className={s.propertyType}>{property.propertyType || 'Property'}</span>
                <Link to={`/property/${property._id}`} className={s.link}>
                    <h3 className={s.title}>{property.title || 'Untitled Property'}</h3>
                </Link>
                <div className={s.location}>
                    <HiOutlineLocationMarker className={s.locationIcon} />
                    <span>
                        {property.city ? `${property.city}, ${property.area || ''}` : 'No location provided'}
                    </span>
                </div>

                <div className={s.specsGrid}>
                    <div className={s.specItem}>
                        <div className={s.specIcon}><FaBed /></div>
                        <div className={s.specValue}>{property.bhk || 0}</div>
                        <div className={s.specLabel}>BHK</div>
                    </div>
                    <div className={`${s.specItem} ${s.specDivider}`}>
                        <div className={s.specIcon}><FaBath /></div>
                        <div className={s.specValue}>{property.bathrooms || 0}</div>
                        <div className={s.specLabel}>Baths</div>
                    </div>
                    <div className={s.specItem}>
                        <div className={s.specIcon}><FaVectorSquare /></div>
                        <div className={s.specValue}>{property.areaSize || 0}</div>
                        <div className={s.specLabel}>Sq.Ft</div>
                    </div>
                </div>
                
                <div className={s.viewDetailsButton}>
                    <Link to={`/property/${property._id}`} className={s.viewDetailsBtn}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
