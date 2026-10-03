import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing database...");
  await prisma.inquiry.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.dealer.deleteMany({});

  console.log("🏢 Seeding MahaRERA verified Nagpur dealers...");

  const dealerRajesh = await prisma.dealer.create({
    data: {
      name: "Rajesh Agrawal",
      agencyName: "Dharampeth Prime Realty",
      email: "rajesh@dharampethrealty.com",
      phone: "+91 98222 41560",
      whatsappNumber: "+919822241560",
      reraNumber: "MAHARERA-A50500018921",
      experienceYears: 14,
      rating: 4.9,
      reviewCount: 42,
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      bio: "Specializing in luxury apartments, heritage bungalows, and premier commercial spaces across Dharampeth, Ramdaspeth, and Civil Lines for over 14 years.",
      isVerified: true,
    },
  });

  const dealerSunita = await prisma.dealer.create({
    data: {
      name: "Sunita Deshmukh",
      agencyName: "Wardha Metro Estates",
      email: "sunita@wardhametroestates.com",
      phone: "+91 94221 88390",
      whatsappNumber: "+919422188390",
      reraNumber: "MAHARERA-A50500024109",
      experienceYears: 9,
      rating: 4.8,
      reviewCount: 38,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Trusted consultant for modern high-rises and gated communities along the Wardha Road Metro corridor, Manish Nagar, and Chhatrapati Square.",
      isVerified: true,
    },
  });

  const dealerAmit = await prisma.dealer.create({
    data: {
      name: "Amit Sharma",
      agencyName: "Orange City Infra & Besa Homes",
      email: "amit@orangecityinfra.in",
      phone: "+91 98901 77312",
      whatsappNumber: "+919890177312",
      reraNumber: "MAHARERA-A50500031852",
      experienceYears: 11,
      rating: 4.7,
      reviewCount: 56,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Dedicated to affordable & premium family apartments in South Nagpur - Besa, Ghogli Road, Pipla, and Beltarodi with 100% clear title verification.",
      isVerified: true,
    },
  });

  const dealerVikram = await prisma.dealer.create({
    data: {
      name: "Vikram Patil",
      agencyName: "MIHAN Tech Corridors Real Estate",
      email: "vikram@mihanproperties.com",
      phone: "+91 97633 99201",
      whatsappNumber: "+919763399201",
      reraNumber: "MAHARERA-A50500045610",
      experienceYears: 7,
      rating: 4.9,
      reviewCount: 29,
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
      bio: "Helping IT professionals at TCS, Infosys, and AIIMS doctors find prime condominiums, studio apartments, and high-ROI rental investments in MIHAN.",
      isVerified: true,
    },
  });

  console.log("🏡 Seeding realistic Nagpur properties...");

  const properties = [
    {
      title: "The Royal Crown 3 BHK Luxury Residency",
      description: "Ultra-luxury 3 BHK residential apartment on West High Court Road, Dharampeth. Features imported Italian marble flooring, VRV central air-conditioning, private sky-deck overlooking the lush city canopy, modular German kitchen, and private lift lobby access.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 3,
      price: 21500000, // ₹2.15 Cr
      priceUnit: "Crores",
      areaSqFt: 2200,
      locality: "Dharampeth",
      address: "WHC Road, Near Shankar Nagar Square, Dharampeth, Nagpur - 440010",
      latitude: 21.1442,
      longitude: 79.0623,
      furnishedStatus: "FURNISHED",
      amenities: JSON.stringify(["Clubhouse", "Infinity Pool", "24/7 Security", "2 Reserved Car Parks", "Power Backup", "Gym", "Private Skydeck"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg", "/images/villa-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500028911",
      dealerId: dealerRajesh.id,
    },
    {
      title: "Dharampeth Elite Heights 4 BHK Penthouse",
      description: "Magnificent duplex penthouse in the heart of Dharampeth. 360-degree panoramic views of Ambazari lake and Seminary Hills. Private rooftop terrace garden, home theatre room, and smart automation system.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 4,
      price: 34000000, // ₹3.40 Cr
      priceUnit: "Crores",
      areaSqFt: 3600,
      locality: "Dharampeth",
      address: "Zenda Chowk, Dharampeth, Nagpur - 440010",
      latitude: 21.1415,
      longitude: 79.0645,
      furnishedStatus: "FURNISHED",
      amenities: JSON.stringify(["Private Terrace", "Home Theatre", "Concierge", "Swimming Pool", "3 Covered Parking", "Smart Home Automation"]),
      images: JSON.stringify(["/images/hero-banner.jpg", "/images/interior-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500031024",
      dealerId: dealerRajesh.id,
    },
    {
      title: "Metro Green Cascades 2 BHK Flat on Wardha Road",
      description: "Spacious 2 BHK home located just 300 meters from Ujjwal Nagar Metro Station on Wardha Road. Well-ventilated corner unit with premium modular fittings, piped gas, and community clubhouse.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 2,
      price: 5800000, // ₹58 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 1150,
      locality: "Wardha Road",
      address: "Opposite Pride Hotel, Wardha Road, Nagpur - 440025",
      latitude: 21.0854,
      longitude: 79.0712,
      furnishedStatus: "SEMI_FURNISHED",
      amenities: JSON.stringify(["Metro Proximity (300m)", "Elevator", "Kids Play Area", "Gated Security", "Covered Parking", "Piped Gas"]),
      images: JSON.stringify(["/images/hero-banner.jpg", "/images/interior-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500019280",
      dealerId: dealerSunita.id,
    },
    {
      title: "Wardha Road Luxury 3 BHK Condominium",
      description: "Executive 3 BHK apartment with balcony overlooking the airport expressway. Close to Chhatrapati Nagar and airport. Includes state-of-the-art gym and rooftop jogging track.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 3,
      price: 8800000, // ₹88 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 1650,
      locality: "Wardha Road",
      address: "Near Chhatrapati Square, Wardha Road, Nagpur - 440015",
      latitude: 21.1012,
      longitude: 79.0789,
      furnishedStatus: "SEMI_FURNISHED",
      amenities: JSON.stringify(["Clubhouse", "Gym", "Jogging Track", "Power Backup", "Rainwater Harvesting", "Intercom"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg"]),
      featured: false,
      reraApproved: true,
      reraNumber: "P50500022419",
      dealerId: dealerSunita.id,
    },
    {
      title: "Besa Sunshine Heights 2 BHK Modern Apartment",
      description: "Sun-drenched, road-facing 2 BHK flat in Besa near Podar International School. High-growth residential belt with great community living, wide internal cement roads, and continuous water supply.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 2,
      price: 4400000, // ₹44 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 1020,
      locality: "Besa",
      address: "Besa-Pipla Road, Near Besa Square, Nagpur - 440037",
      latitude: 21.0805,
      longitude: 79.1034,
      furnishedStatus: "UNFURNISHED",
      amenities: JSON.stringify(["Near Reputed Schools", "Solar Water Heating", "CCTV Surveillance", "Lift with Battery Backup", "Reserved Parking"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/villa-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500015671",
      dealerId: dealerAmit.id,
    },
    {
      title: "Shanti Greens Independent 4 BHK Villa in Besa",
      description: "Brand new independent contemporary 4 BHK duplex villa with private landscaped garden, double-height living room, modular Italian kitchen, and covered car porch for two SUVs.",
      listingType: "BUY",
      propertyType: "VILLA",
      bhk: 4,
      price: 16500000, // ₹1.65 Cr
      priceUnit: "Crores",
      areaSqFt: 2800,
      locality: "Besa",
      address: "Ghogli Road, Near Besa Lake, Nagpur - 440037",
      latitude: 21.0772,
      longitude: 79.1121,
      furnishedStatus: "SEMI_FURNISHED",
      amenities: JSON.stringify(["Private Garden", "Dual Car Porch", "Double Height Ceiling", "Borewell + Municipal Water", "Solar Rooftop", "CCTV"]),
      images: JSON.stringify(["/images/villa-1.jpg", "/images/interior-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500041289",
      dealerId: dealerAmit.id,
    },
    {
      title: "Manish Nagar Lakeview 2 BHK Premium Flat",
      description: "Ready-to-move 2 BHK apartment in prime Manish Nagar. Walking distance from Beltarodi police station and local organic market. Excellent construction quality with teakwood doors and branded sanitaryware.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 2,
      price: 4950000, // ₹49.5 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 1100,
      locality: "Manish Nagar",
      address: "Beltarodi Road, Manish Nagar, Nagpur - 440015",
      latitude: 21.0963,
      longitude: 79.0889,
      furnishedStatus: "SEMI_FURNISHED",
      amenities: JSON.stringify(["Branded Elevators", "Covered Car Parking", "Community Hall", "24/7 Security", "Fire Fighting System"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg"]),
      featured: false,
      reraApproved: true,
      reraNumber: "P50500033102",
      dealerId: dealerSunita.id,
    },
    {
      title: "MIHAN Cyber Palms 1 BHK Smart Studio",
      description: "Compact smart 1 BHK designer studio adjacent to TCS and Infosys campuses in MIHAN SEZ. High rental demand from IT professionals with 6.5%+ gross rental yield potential.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 1,
      price: 2600000, // ₹26 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 620,
      locality: "MIHAN",
      address: "SEZ Sector 21, MIHAN South, Nagpur - 441108",
      latitude: 21.0256,
      longitude: 79.0435,
      furnishedStatus: "FURNISHED",
      amenities: JSON.stringify(["High Rental Yield", "Fully Furnished Studio", "High-speed Wi-Fi Zone", "Gym", "Cafeteria", "24/7 Security"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500018844",
      dealerId: dealerVikram.id,
    },
    {
      title: "AIIMS Horizon Towers 2 BHK Condo in MIHAN",
      description: "Sophisticated 2 BHK apartment just 5 mins from AIIMS Nagpur and IIM Nagpur campus. Spacious bedrooms with large glass windows, clubhouse access, and lush greenery.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 2,
      price: 5200000, // ₹52 Lakhs
      priceUnit: "Lakhs",
      areaSqFt: 1240,
      locality: "MIHAN",
      address: "Near AIIMS Nagpur Campus, MIHAN, Nagpur - 441108",
      latitude: 21.0312,
      longitude: 79.0510,
      furnishedStatus: "UNFURNISHED",
      amenities: JSON.stringify(["Near AIIMS & IIM", "Swimming Pool", "Badminton Court", "Lush Landscaped Park", "Covered Parking"]),
      images: JSON.stringify(["/images/hero-banner.jpg", "/images/interior-1.jpg"]),
      featured: false,
      reraApproved: true,
      reraNumber: "P50500029301",
      dealerId: dealerVikram.id,
    },
    {
      title: "Ramdaspeth Boulevard 3 BHK Medical Enclave Flat",
      description: "Prestigious 3 BHK flat situated in Ramdaspeth's serene doctor and legal enclave. Marble finishes, silent residential street, and 2-minute walking access to Central Bazar Road.",
      listingType: "BUY",
      propertyType: "APARTMENT",
      bhk: 3,
      price: 18500000, // ₹1.85 Cr
      priceUnit: "Crores",
      areaSqFt: 1950,
      locality: "Ramdaspeth",
      address: "Central Bazar Road, Ramdaspeth, Nagpur - 440010",
      latitude: 21.1345,
      longitude: 79.0734,
      furnishedStatus: "FURNISHED",
      amenities: JSON.stringify(["Prime Central Location", "2 Covered Parking", "Generator Backup", "Security Guards", "Lobby Lounge"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500021940",
      dealerId: dealerRajesh.id,
    },
    {
      title: "Sadar Heritage 2 BHK Rental Flat",
      description: "Furnished 2 BHK residential apartment for rent in Sadar. Ideal for bank executives and defense officers. Walking distance to Sadar Bazar, Mount Road, and Japanese Garden.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      bhk: 2,
      price: 24000, // ₹24,000 / month
      priceUnit: "Thousands",
      areaSqFt: 1050,
      locality: "Sadar",
      address: "Residency Road, Sadar, Nagpur - 440001",
      latitude: 21.1625,
      longitude: 79.0841,
      furnishedStatus: "FURNISHED",
      amenities: JSON.stringify(["Fully Furnished", "Air Conditioned", "Water Purifier", "Lift Access", "Covered Bike & Car Parking"]),
      images: JSON.stringify(["/images/interior-1.jpg", "/images/hero-banner.jpg"]),
      featured: false,
      reraApproved: true,
      reraNumber: "P50500014782",
      dealerId: dealerRajesh.id,
    },
    {
      title: "Sitabuldi Central Commercial Suite",
      description: "High-visibility first floor commercial shop/office directly opposite Sitabuldi Metro Interchange station. Unbeatable footfall, glass frontage, and dedicated customer elevator.",
      listingType: "BUY",
      propertyType: "COMMERCIAL",
      bhk: 1,
      price: 12500000, // ₹1.25 Cr
      priceUnit: "Crores",
      areaSqFt: 850,
      locality: "Sitabuldi",
      address: "Main Road, Sitabuldi, Nagpur - 440012",
      latitude: 21.1458,
      longitude: 79.0882,
      furnishedStatus: "SEMI_FURNISHED",
      amenities: JSON.stringify(["Opposite Metro Station", "High Footfall Zone", "Glass Frontage", "24/7 Power Backup", "Commercial Elevator"]),
      images: JSON.stringify(["/images/hero-banner.jpg", "/images/interior-1.jpg"]),
      featured: true,
      reraApproved: true,
      reraNumber: "P50500030219",
      dealerId: dealerRajesh.id,
    },
  ];

  const createdProperties = [];
  for (const prop of properties) {
    const p = await prisma.property.create({ data: prop });
    createdProperties.push(p);
  }

  console.log("📨 Seeding realistic buyer inquiries...");

  await prisma.inquiry.createMany({
    data: [
      {
        propertyId: createdProperties[0].id, // Royal Crown Dharampeth
        dealerId: dealerRajesh.id,
        buyerName: "Dr. Sandeep Kothari",
        buyerPhone: "+91 98230 11223",
        buyerEmail: "dr.kothari@nagpurmed.com",
        message: "Interested in the 3 BHK unit on the 8th floor. Would like to schedule an inspection this Saturday morning.",
        status: "NEW",
      },
      {
        propertyId: createdProperties[2].id, // Metro Green Wardha Road
        dealerId: dealerSunita.id,
        buyerName: "Pooja Deshpande",
        buyerPhone: "+91 97654 44556",
        buyerEmail: "pooja.d@techmahindra.com",
        message: "Looking for family home near metro. What is the final negotiable price and bank loan tie-up with SBI?",
        status: "CONTACTED",
      },
      {
        propertyId: createdProperties[4].id, // Besa Sunshine Heights
        dealerId: dealerAmit.id,
        buyerName: "Nitin Bhalerao",
        buyerPhone: "+91 99701 88990",
        buyerEmail: "nitin.bhalerao@gmail.com",
        message: "Can we visit the sample flat this Sunday? Also wanted to verify if OC (Occupancy Certificate) is received.",
        status: "VISIT_SCHEDULED",
      },
      {
        propertyId: createdProperties[7].id, // MIHAN Cyber Palms
        dealerId: dealerVikram.id,
        buyerName: "Kunal Bansod",
        buyerPhone: "+91 94050 66778",
        buyerEmail: "kunal.b@infosys.com",
        message: "Working at Infosys SEZ campus. Seeking immediate investment with rental agreement support.",
        status: "NEW",
      },
      {
        propertyId: createdProperties[5].id, // Besa Shanti Villa
        dealerId: dealerAmit.id,
        buyerName: "Harishankar Tiwari",
        buyerPhone: "+91 98229 33445",
        buyerEmail: "htiwari_biz@rediffmail.com",
        message: "Looking for independent villa with garden. Please share layout map and MahaRERA documents.",
        status: "CONTACTED",
      },
    ],
  });

  console.log("✅ Database seeded successfully with Nagpur dealers, properties, and inquiries!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
