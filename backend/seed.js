import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user_model.js";
import Property from "./models/property.model.js";

const seedDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://sujitmalla000_db_user:ps91lirlTpoeKjOi@cluster0.hv8gtcw.mongodb.net/RealState");
        console.log("DB connected successfully");

        // 1. Create a Seller Account
        const hashedPassword = await bcrypt.hash("password123", 10);
        const sellerEmail = "bhubaneswar_seller@example.com";
        
        let seller = await User.findOne({ email: sellerEmail });
        
        if (!seller) {
            seller = new User({
                name: "Bhubaneswar Seller",
                email: sellerEmail,
                password: hashedPassword,
                role: "seller",
                phone: "9876543210",
                address: "Khandagiri, Bhubaneswar",
                isApproved: true,
                isVerified: true
            });
            await seller.save();
            console.log("Seller account created!");
        } else {
            console.log("Seller already exists!");
        }

        // 2. Create 10 Properties
        const propertyTypes = ["flat", "apartment", "villa", "house", "plot", "commercial"];
        const furnishingTypes = ["furnished", "semi-furnished", "unfurnished"];
        const locations = ["Patia", "Khandagiri", "Saheed Nagar", "Jayadev Vihar", "Chandrasekharpur", "Nayapalli", "Bapuji Nagar", "Janpath", "Rasulgarh", "Mancheswar"];

        const propertiesData = [];
        for (let i = 0; i < 10; i++) {
            const loc = locations[i % locations.length];
            const pType = propertyTypes[i % propertyTypes.length];
            propertiesData.push({
                title: `${pType.toUpperCase()} in ${loc}, Bhubaneswar`,
                description: `Beautiful ${pType} available for sale in ${loc}, Bhubaneswar. Equipped with modern amenities and prime location access.`,
                price: Math.floor(Math.random() * 5000000) + 1500000,
                city: "Bhubaneswar",
                area: loc,
                pincode: `75100${i % 9 + 1}`,
                propertyType: pType,
                bhk: pType === "plot" || pType === "commercial" ? null : `${Math.floor(Math.random() * 3) + 1} BHK`,
                bathrooms: pType === "plot" || pType === "commercial" ? null : Math.floor(Math.random() * 3) + 1,
                areaSize: Math.floor(Math.random() * 1500) + 800,
                furnishing: furnishingTypes[i % furnishingTypes.length],
                amenities: ["Parking", "Water Supply", "Power Backup", "Security"],
                status: "sale",
                images: [
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ],
                seller: seller._id,
                isVerified: true
            });
        }

        await Property.insertMany(propertiesData);
        console.log("10 Properties inserted successfully in Bhubaneswar location!");

        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
    }
};

seedDatabase();
