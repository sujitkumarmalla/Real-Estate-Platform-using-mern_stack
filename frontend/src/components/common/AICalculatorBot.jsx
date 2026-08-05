import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { HiCalculator, HiX, HiSparkles } from 'react-icons/hi';

const AICalculatorBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [property, setProperty] = useState(null);
    const location = useLocation();
    
    // Calculator States
    const [price, setPrice] = useState(500000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(8.5); // Standard home loan rate in India
    const [tenureYears, setTenureYears] = useState(20);

    // Detect route changes to see if we are on a property details page
    useEffect(() => {
        const match = matchPath({ path: "/property/:id" }, location.pathname);
        const propertyId = match?.params?.id;

        if (propertyId) {
            // Fetch property details dynamically
            const fetchProperty = async () => {
                try {
                    const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/property/${propertyId}`);
                    if (res.data.property) {
                        setProperty(res.data.property);
                        setPrice(res.data.property.price);
                    }
                } catch (error) {
                    console.error("Calculator failed to fetch property details", error);
                }
            };
            fetchProperty();
        } else {
            setProperty(null);
        }
    }, [location.pathname]);

    // Calculate Loan and EMI metrics
    const downPaymentAmount = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPaymentAmount;
    
    const calculateEMI = () => {
        const monthlyRate = (interestRate / 12) / 100;
        const totalMonths = tenureYears * 12;
        if (monthlyRate === 0) return loanAmount / totalMonths;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
               (Math.pow(1 + monthlyRate, totalMonths) - 1);
    };

    const monthlyEMI = calculateEMI();
    const totalCostOfLoan = monthlyEMI * tenureYears * 12;
    const totalInterestPayable = totalCostOfLoan - loanAmount;
    const totalCostOfOwnership = price + totalInterestPayable;
    const minRecommendedIncome = monthlyEMI / 0.35; // Recommended Debt-to-Income ratio is 35%

    return (
        <div className="fixed bottom-6 right-6 z-[2000] font-sans">
            {/* Pulsing Floating Action Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative cursor-pointer group"
                >
                    <HiSparkles size={24} className="absolute top-2.5 right-2.5 text-amber-300 animate-pulse" />
                    <HiCalculator size={28} className="group-hover:rotate-12 transition-transform duration-300" />
                    
                    {/* Pulsing Aura */}
                    <span className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping pointer-events-none"></span>
                </button>
            )}

            {/* Smart Calculator Panel */}
            {isOpen && (
                <div className="bg-white rounded-3xl w-[360px] sm:w-[400px] h-[520px] flex flex-col shadow-2xl overflow-hidden border border-border animate-scale-up text-left">
                    {/* Header */}
                    <div className="bg-primary text-white p-5 flex justify-between items-center relative overflow-hidden shrink-0">
                        {/* Background Sparkles Effect */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/20 rounded-full blur-xl pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <HiCalculator className="text-white text-xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-sm tracking-wide uppercase leading-none">Smart Calculator</h3>
                                <p className="text-[10px] opacity-85 mt-1">Calculate down payment & monthly EMI</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer"
                        >
                            <HiX size={20} />
                        </button>
                    </div>

                    {/* Calculator Body */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left bg-slate-50/30">
                        {/* Context info for property */}
                        {property && (
                            <div className="bg-primary-light/50 border border-primary/20 rounded-xl p-3 text-xs text-left">
                                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-0.5">Selected Property</p>
                                <p className="font-bold text-text-main truncate">{property.title}</p>
                            </div>
                        )}

                        {/* Property Price */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Property Price (₹)</label>
                            <input 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full p-2.5 rounded-xl border border-border text-xs font-bold outline-none bg-white focus:border-primary shadow-sm"
                            />
                        </div>

                        {/* Down Payment Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Down Payment</label>
                                <span className="text-xs font-bold text-primary">{downPaymentPercent}% (₹{downPaymentAmount.toLocaleString('en-IN')})</span>
                            </div>
                            <input 
                                type="range"
                                min="10"
                                max="80"
                                step="5"
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Interest Rate</label>
                                <span className="text-xs font-bold text-primary">{interestRate}%</span>
                            </div>
                            <input 
                                type="range"
                                min="3"
                                max="15"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Loan Tenure */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Loan Tenure</label>
                                <span className="text-xs font-bold text-primary">{tenureYears} Years</span>
                            </div>
                            <input 
                                type="range"
                                min="5"
                                max="30"
                                step="5"
                                value={tenureYears}
                                onChange={(e) => setTenureYears(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Visual Ratio Bar Chart */}
                        <div className="pt-2">
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-text-muted mb-2">Cost Breakdown</span>
                            <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200">
                                <div 
                                    style={{ width: `${(downPaymentAmount/totalCostOfOwnership)*100}%` }} 
                                    className="bg-primary hover:opacity-90"
                                    title={`Down Payment: ₹${downPaymentAmount.toLocaleString('en-IN')}`}
                                ></div>
                                <div 
                                    style={{ width: `${(loanAmount/totalCostOfOwnership)*100}%` }} 
                                    className="bg-blue-500 hover:opacity-90"
                                    title={`Loan Principal: ₹${loanAmount.toLocaleString('en-IN')}`}
                                ></div>
                                <div 
                                    style={{ width: `${(totalInterestPayable/totalCostOfOwnership)*100}%` }} 
                                    className="bg-amber-400 hover:opacity-90"
                                    title={`Total Interest: ₹${totalInterestPayable.toLocaleString('en-IN')}`}
                                ></div>
                            </div>
                            <div className="flex justify-start gap-4 text-[9px] font-bold text-text-muted mt-2">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm"></span> Down Payment</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Principal</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span> Interest</span>
                            </div>
                        </div>

                        {/* Output Metrics */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-border space-y-2.5 shadow-inner">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-bold">Monthly Payable Amount (EMI)</span>
                                <span className="font-black text-primary text-sm">₹{monthlyEMI.toLocaleString('en-IN', {maximumFractionDigits: 0})}/mo</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-medium">Loan Principal Amount</span>
                                <span className="font-bold text-text-main">₹{loanAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-medium">Total Interest Payable</span>
                                <span className="font-bold text-text-main">₹{totalInterestPayable.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-border/80">
                                <span className="text-text-muted font-bold">Recommended Salary</span>
                                <span className="font-black text-teal-600">₹{minRecommendedIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}/mo</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICalculatorBot;
