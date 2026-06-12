import React, { useEffect, useState } from 'react'
import {landingPageStyles as s} from "../../assets/dummyStyles"
import Navbar from '../../components/common/Navbar'
import { HiCurrencyDollar, HiHome, HiLightningBolt, HiOfficeBuilding, HiOutlineLocationMarker, HiSearch, HiShieldCheck, HiVideoCamera } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import API_URL from '../../config'
import banner from "../../assets/bannerimage.png"
import PropertyCard from '../../components/PropertyCard'
import Footer from '../../components/common/Footer'

const LandingPage = () => {
  const navigate=useNavigate();
  const {user,token}=useAuth();
  const [properties,setProperties]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [searchTerm,setSearchTerm]=useState("");
  const [propertyType,setPropertyType]=useState("Select Type");
  const [propertyCount,setPropertyCount]=useState({
    flat:0,
    villa:0,
    penthouse:0,
    commercial:0,
  });
  const [wishlistedIds,setWishlistedIds]=useState([])

  useEffect(()=>{
    fetchProperties();
    fetchCounts();
    if(user){
      fetchwishlist();
    }
  },[user]);

  const fetchwishlist=async()=>{
    try {
      const res=await axios.get(`${API_URL.replace(/\/$/, '')}/api/wishlist`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      setWishlistedIds(
        (res.data.data || []).filter((item)=>item.property).map((item)=>String(item.property._id)),
      )
    } catch (error) {
      console.error("Failed to fetch wishlist",error)
    }
  };

  const handleToggleWishlist=async(propertId)=>{
    try {
      const isWishlisted=wishlistedIds.includes(propertId);
      if(isWishlisted){
        await axios.delete(`${API_URL.replace(/\/$/, '')}/api/wishlist/${propertId}`,
          {
            headers:{Authorization:`Bearer ${token}`},
          }
        );
        setWishlistedIds((prev)=>prev.filter((id)=>id!==propertId))
      }else{
        await axios.post(`${API_URL.replace(/\/$/, '')}/api/wishlist/${propertId}`,{},{
           headers:{Authorization:`Bearer ${token}`},
        });
        setWishlistedIds((prev)=>[...prev,propertId])
      }
    } catch (error) {
      console.error("Failed to toggle wishlist",error)
    }
  }

  const fetchCounts=async()=>{
    try {
      const res=await axios.get(`${API_URL.replace(/\/$/, '')}/api/property/counts`);
      if(res.data.success){
        setPropertyCount(res.data.counts);
      }
    } catch (error) {
       console.error("Failed to fetch property counts:",error)
    }
  };

  const fetchProperties=async(search="")=>{
    try {
      setLoading(true);
      const res=await axios.get(`${API_URL.replace(/\/$/, '')}/api/property?city=${search}`);
      setProperties(res.data.properties || res.data ||[]);
      setError(null)
    } catch (error) {
       console.error("Failed to load properties.Please try again");
       setError("Failed to load properties");
    }finally{
      setLoading(false);
    }
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    const params=new URLSearchParams();
    if(searchTerm) params.append("city",searchTerm);
    if(propertyType!=="Select Type") params.append("type",propertyType);
    navigate(`/properties?${params.toString()}`)
  }

  const getCount = (type) => {
    if (!propertyCount) return 0;
    // Handle case-insensitive keys and synonyms
    const keys = Object.keys(propertyCount);
    const key = keys.find(k => k.toLowerCase() === type.toLowerCase());
    let count = propertyCount[key] || 0;
    
    // Add synonyms
    if (type === 'flat') {
      const apartmentKey = keys.find(k => k.toLowerCase() === 'apartment');
      if (apartmentKey) count += propertyCount[apartmentKey];
    }
    if (type === 'villa') {
      const houseKey = keys.find(k => k.toLowerCase() === 'house');
      if (houseKey) count += propertyCount[houseKey];
    }
    
    return count;
  };

  const categories = [
    {
      name: "Modern Flats",
      count: getCount("flat"),
      icon: <HiOfficeBuilding size={32} />,
      type: "flat",
    },
    {
      name: "Luxury Villas",
      count: getCount("villa"),
      icon: <HiHome size={32} />,
      type: "villa",
    },
    {
      name: "Penthouse",
      count: getCount("penthouse"),
      icon: <HiOfficeBuilding size={32} />,
      type: "penthouse",
    },
    {
      name: "Commercial",
      count: getCount("commercial"),
      icon: <HiOfficeBuilding size={32} />,
      type: "commercial",
    },
  ];

  const features = [
    {
      title: "Verified Trust",
      desc: "Every listing is strictly audited for ownership, condition, and legality.",
      icon: <HiShieldCheck size={24} />,
    },
    {
      title: "Smart Search",
      desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
      icon: <HiLightningBolt size={24} />,
    },
    {
      title: "Best Value",
      desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
      icon: <HiCurrencyDollar size={24} />,
    },
    {
      title: "Virtual Tours",
      desc: "High-definition 3D tours allow you to experience the property from home.",
      icon: <HiVideoCamera size={24} />,
    },
  ];

  return (
    <div className={s.bgMain}>
        <Navbar />
        
        {/* Hero Section */}
        <section className={s.heroSection}>
          <div className={s.heroContent}>
            <span className={s.badge}>Trusted by 20,000+ homeowners</span>
            <h1 className={s.heroTitle}>
              Find Your <span className={s.textGradient}>Perfect</span> Next Chapter
            </h1>
            <p className={s.heroSubtitle}>
              Experience the most advanced real estate search platform. Discover verified 
              listing, connect with top agents, and find a place you'll love.
            </p>
            
            <form onSubmit={handleSearch} className={s.searchForm}>
              <div className={s.searchField}>
                <div className={s.textPrimary}>
                  <HiOutlineLocationMarker size={26} />
                </div>
                <div className={s.flexCol}>
                  <label className={s.labelSmall}>Location</label>
                  <input 
                    type="text" 
                    placeholder='Where are you looking?' 
                    value={searchTerm} 
                    onChange={(e)=>setSearchTerm(e.target.value)} 
                    className={s.inputTransparent} 
                  />
                </div>
              </div>
              <div className={s.searchDivider}></div>
              <div className={s.searchField}>
                <div className={s.textPrimary}>
                  <HiHome size={26} />
                </div>
                <div className={s.flexCol}>
                  <label className={s.labelSmall}>Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={`${s.inputTransparent} cursor-pointer`}
                  >
                    <option value="Select Type">Select Type</option>
                    <option value="flat">Flat/Apartment</option>
                    <option value="villa">Villa/House</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={s.searchButton}>
                <HiSearch size={22} />Search
              </button>
            </form>

            <div className={s.statsContainer}>
              <div className={s.statItemFlex}>
                <h3 className={s.statNumber}>12k+</h3>
                <p className={s.statLabel} >Ready Properties</p>
              </div>
              <div className={s.statItemBorder}>
                <h3 className={s.statNumber}>500+</h3>
                <p className={s.statLabel} >Agent Network</p>
              </div>
              <div className={s.statItemBorder}>
                <h3 className={s.statNumber}>4.9/5</h3>
                <p className={s.statLabel} >User Rating</p>
              </div>
            </div>
          </div>
          
          <div className={s.heroImageContainer}>
            <div className={s.imageWrapper}>
              <img src={banner} className={s.heroImage} alt="Real Estate Banner"/>
              <div className={s.verifiedBadge}>
                <div className={s.badgeIconWrapper}>
                   <HiShieldCheck className="text-primary" size={24} />
                </div>
                <div>
                   <p className={s.badgeTitle}>100% Verified</p>
                   <p className={s.badgeText}>Safe & Secure Listings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={s.categorySection}>
          <div className={s.container}>
            <div className={s.categoryHeader}>
              <div className={s.categoryHeaderText}>
                <h2 className={s.categoryTitle}>Explore by Category</h2>
                <p className={s.categoryDesc}>Find the perfect type of property that fits your lifestyle and needs.</p>
              </div>
            </div>
            <div className={s.categoryGrid}>
              {categories.map((cat, index) => (
                <div 
                  key={index} 
                  className={s.categoryCard}
                  onClick={() => navigate(`/properties?type=${cat.type}`)}
                >
                  <div className={s.categoryIconWrapper}>{cat.icon}</div>
                  <h3 className={s.categoryName}>{cat.name}</h3>
                  <p className={s.categoryCount}>{cat.count} Properties</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className={s.featuredSection}>
          <div className={s.container}>
            <div className={s.featuredHeader}>
              <span className={s.featuredBadge}>Top Picks</span>
              <h2 className={s.featuredTitle}>Featured Properties</h2>
              <p className={s.featuredSubtitle}>Discover our handpicked selection of premium properties.</p>
            </div>

            {loading ? (
              <div className={s.loadingContainer}>
                <div className={s.loader}></div>
              </div>
            ) : error ? (
              <div className={s.errorContainer}>
                <p>{error}</p>
              </div>
            ) : (
              <div className={s.propertiesGrid}>
                {properties.slice(0, 6).map((property) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property} 
                    isWishlisted={wishlistedIds.includes(String(property._id))}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}

            <div className={s.discoverButtonContainer}>
              <button onClick={() => navigate('/properties')} className={s.discoverButton}>
                Discover All Properties
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={s.featuresSection}>
           <div className={s.featuresContainer}>
              <div className={s.featuresContent}>
                 <h2 className={s.featuresHeading}>Why Choose Us?</h2>
                 <p className={s.featuresSubtext}>
                    We provide a seamless experience for buying, selling, and renting properties with advanced technology and verified trust.
                 </p>
                 <div className={s.featuresListItems}>
                    {features.map((feature, index) => (
                       <div key={index} className={s.listItem}>
                          <div className={s.featureIconWrapper}>{feature.icon}</div>
                          <div>
                             <h3 className={s.featureTitle}>{feature.title}</h3>
                             <p className={s.featureDesc}>{feature.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className={s.featuresList}>
                  {/* Additional visual element or image could go here */}
              </div>
           </div>
        </section>

        {/* How It Works Section */}
        <section className={s.processSection}>
           <div className={s.processHeader}>
              <span className={s.processBadge}>Step by Step</span>
              <h2 className={s.processTitle}>How It Works</h2>
              <p className={s.processSubtitle}>Follow these simple steps to find and secure your next property.</p>
           </div>
           <div className={s.container}>
              <div className={s.processGrid}>
                 {[
                    { title: "Search & Discover", desc: "Browse through thousands of verified listings in your desired location.", step: "01" },
                    { title: "Virtual or In-person Tour", desc: "Experience the property through 3D virtual tours or schedule a visit.", step: "02" },
                    { title: "Secure Your Deal", desc: "Complete the paperwork with expert guidance and move into your new home.", step: "03" }
                 ].map((step, index) => (
                    <div key={index} className={s.processCard}>
                       <div className={s.stepNumber}>{step.step}</div>
                       <h3 className={s.processCardTitle}>{step.title}</h3>
                       <p className={s.processCardDesc}>{step.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <Footer />
    </div>
  )
}

export default LandingPage