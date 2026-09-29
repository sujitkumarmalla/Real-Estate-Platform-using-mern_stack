import React, { useEffect, useState } from 'react'
import {landingPageStyles as s} from "../../assets/dummyStyles"
import Navbar from '../../components/common/Navbar'
import { HiCurrencyDollar, HiHome, HiLightningBolt, HiOfficeBuilding, HiOutlineLocationMarker, HiSearch, HiShieldCheck, HiVideoCamera } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import API_URL from '../../config'
import banner from "../../assets/bannerimage.png"
import heroBg from "../../assets/hero_bg.jpg"
import PropertyCard from '../../components/PropertyCard'
import Footer from '../../components/common/Footer'
import toast from 'react-hot-toast'

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
       toast.error("Failed to load properties");
       setError("Failed to load properties");
    }finally{
      setLoading(false);
    }
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    const params=new URLSearchParams();
    if(searchTerm) params.append("location",searchTerm);
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

  const reviews = [
    { name: "John Doe", role: "Home Buyer", rating: 5, text: "Absolutely seamless experience! Found my dream home within weeks and the verification process gave me total peace of mind." },
    { name: "Sarah Smith", role: "Seller", rating: 5, text: "The platform's 3D tours helped me sell my property 2x faster than traditional agents. Highly recommended!" },
    { name: "Michael Lee", role: "Investor", rating: 4, text: "Great selection of commercial properties. The direct messaging feature with sellers saved me thousands in commissions." },
    { name: "Emily Davis", role: "Tenant", rating: 5, text: "I love the UI and how easy it is to search by amenities. Moved into my new apartment hassle-free!" },
    { name: "David Wilson", role: "Property Flipper", rating: 5, text: "The verified listings ensure I don't waste time on fake ads. RealEstate Platform is my go-to tool now." },
  ];

  return (
    <div className={s.bgMain}>
        <Navbar />
        
        {/* Hero Section */}
        <section 
          className={`${s.heroSection} relative overflow-hidden`}
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          <div className="absolute inset-0 bg-[#061e27]/70 backdrop-blur-[4px] z-0 pointer-events-none"></div>
          <div className={`${s.heroContent} animate-slide-up relative z-10 text-white`}>
            <h1 className={`${s.heroTitle} !text-white`}>
              Find Your <span className={`${s.textGradient} animate-gradient`}>Perfect</span> Next Chapter
            </h1>
            <p className={`${s.heroSubtitle} !text-blue-100`}>
              Experience the most advanced real estate search platform. Discover verified 
              listing, connect with top agents, and find a place you'll love.
            </p>
            
            <form onSubmit={handleSearch} className={`${s.searchForm} !bg-white/95 !shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}>
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
                    className={`${s.inputTransparent} !text-slate-800 placeholder:text-slate-400`}
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
                    className={`${s.inputTransparent} !text-slate-800 cursor-pointer`}
                  >
                    <option value="Select Type">Select Type</option>
                    <option value="flat">Flat/Apartment</option>
                    <option value="villa">Villa/House</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={`${s.searchButton} !shadow-lg`}>
                <HiSearch size={22} />Search
              </button>
            </form>

            <div className={s.statsContainer}>
              <div className={s.statItemFlex}>
                <h3 className={`${s.statNumber} !text-white`}>15+</h3>
                <p className={`${s.statLabel} !text-blue-200`} >Years Experience</p>
              </div>
              <div className={s.statItemBorder}>
                <h3 className={`${s.statNumber} !text-white`}>12k+</h3>
                <p className={`${s.statLabel} !text-blue-200`} >Ready Properties</p>
              </div>
              <div className={s.statItemBorder}>
                <h3 className={`${s.statNumber} !text-white`}>10k+</h3>
                <p className={`${s.statLabel} !text-blue-200`} >Happy Clients</p>
              </div>
            </div>
          </div>
          
          <div className={`${s.heroImageContainer} animate-fade-in`}>
            <div className={s.imageWrapper}>
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className={`${s.heroImage} transition-transform duration-700 hover:scale-105`} alt="Premium Real Estate"/>
              <div className={`${s.verifiedBadge} animate-bounce-slow`}>
                <div className={s.badgeIconWrapper}>
                   <HiShieldCheck className="text-primary" size={24} />
                </div>
                <div>
                   <p className={s.badgeTitle}>100% Govt Approved</p>
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
                  <div className="grid grid-cols-2 gap-4 h-full">
                      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Mansion" className="w-full h-[300px] md:h-full object-cover rounded-[2rem] shadow-lg hover:scale-[1.02] transition-transform duration-300" />
                      <div className="grid grid-rows-2 gap-4 h-full">
                          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Villa" className="w-full h-[142px] md:h-full object-cover rounded-[2rem] shadow-lg hover:scale-[1.02] transition-transform duration-300" />
                          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Interior" className="w-full h-[142px] md:h-full object-cover rounded-[2rem] shadow-lg hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                  </div>
              </div>
           </div>
        </section>

        {/* How It Works Section */}
        <section className={s.processSection}>
           <div className={s.processHeader}>
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

        {/* Testimonials Marquee Section */}
        <section className="py-20 overflow-hidden bg-bg-alt">
           <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mt-4 mb-4">What Our Users Say</h2>
              <p className="text-[#6b7280] max-w-2xl mx-auto">Real experiences from our buyers, sellers, and agents.</p>
           </div>
           
           <div className="relative w-full flex overflow-hidden group">
              <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                 {[...reviews, ...reviews].map((review, index) => (
                    <div key={index} className="w-[350px] md:w-[450px] mx-4 p-8 bg-white rounded-3xl shadow-sm border border-[#e5e7eb] flex flex-col gap-4 flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-md cursor-pointer">
                       <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                       </div>
                       <p className="text-[#6b7280] italic text-lg leading-relaxed line-clamp-3">"{review.text}"</p>
                       <div className="mt-auto pt-4 border-t border-[#e5e7eb] flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#ccfbf1] flex items-center justify-center text-[#0d9488] font-bold text-lg">
                             {review.name.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-bold text-[#111827] leading-none">{review.name}</h4>
                             <p className="text-sm text-[#6b7280] mt-1">{review.role}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

         {/* Image Gallery Section */}
         <section className="py-20 px-4 md:px-8 max-w-[1280px] mx-auto animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mt-4 mb-4">A Glimpse of Paradise</h2>
              <p className="text-[#6b7280] max-w-2xl mx-auto">Explore stunning properties that blend modern architecture with breathtaking landscapes.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-2 row-span-2 h-[400px]">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Gallery House 1" className="w-full h-full object-cover rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-500"/>
                </div>
                <div className="col-span-1 md:col-span-1 h-[192px]">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Gallery House 2" className="w-full h-full object-cover rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-500"/>
                </div>
                <div className="col-span-1 md:col-span-1 h-[192px]">
                    <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Gallery House 3" className="w-full h-full object-cover rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-500"/>
                </div>
                <div className="col-span-2 md:col-span-2 h-[192px]">
                    <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Gallery House 4" className="w-full h-full object-cover rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-500"/>
                </div>
            </div>
         </section>

        <Footer />
    </div>
  )
}

export default LandingPage