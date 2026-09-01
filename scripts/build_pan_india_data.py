import json
import os

states = [
    {"id": "maharashtra", "name": "Maharashtra", "code": "MH", "region": "Western India", "description": "Land of Maratha heritage, caves, bustling coastal cities, and Western Ghats.", "hero_image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f"},
    {"id": "rajasthan", "name": "Rajasthan", "code": "RJ", "region": "Northern India", "description": "The Land of Kings, majestic desert forts, grand palaces, and vibrant arts.", "hero_image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41"},
    {"id": "delhi", "name": "Delhi (NCT)", "code": "DL", "region": "Northern India", "description": "The historic national capital blending ancient Sultanate monuments and Mughal splendors.", "hero_image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5"},
    {"id": "uttar-pradesh", "name": "Uttar Pradesh", "code": "UP", "region": "Northern India", "description": "Heartland of Indian spiritual heritage, Mughal architectural wonders, and sacred rivers.", "hero_image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523"},
    {"id": "kerala", "name": "Kerala", "code": "KL", "region": "Southern India", "description": "God's Own Country, celebrated for tropical backwaters, Ayurvedic traditions, and hill tea estates.", "hero_image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944"},
    {"id": "goa", "name": "Goa", "code": "GA", "region": "Western India", "description": "Coastal paradise renowned for Portuguese Baroque cathedrals, pristine beaches, and forts.", "hero_image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"},
    {"id": "karnataka", "name": "Karnataka", "code": "KA", "region": "Southern India", "description": "Home to Vijayanagara empire ruins, Hoysala stone temples, and Silicon Valley innovations.", "hero_image_url": "https://images.unsplash.com/photo-1600100397608-f010e422a59e"},
    {"id": "telangana", "name": "Telangana", "code": "TS", "region": "Southern India", "description": "The realm of the Nizams, pearl bazaars, and colossal medieval granite citadels.", "hero_image_url": "https://images.unsplash.com/photo-1616198814651-e71f960c3180"},
    {"id": "west-bengal", "name": "West Bengal", "code": "WB", "region": "Eastern India", "description": "Cultural and intellectual capital, Victorian architecture, terracotta temples, and tea hills.", "hero_image_url": "https://images.unsplash.com/photo-1558431382-27e303142255"},
    {"id": "punjab", "name": "Punjab", "code": "PB", "region": "Northern India", "description": "Land of five rivers, heroic heritage, spiritual devotion, and warm agricultural bounty.", "hero_image_url": "https://images.unsplash.com/photo-1588096344356-9b634839cf9e"},
    {"id": "jammu-kashmir", "name": "Jammu & Kashmir", "code": "JK", "region": "Northern India", "description": "Paradise on Earth with serene Alpine lakes, Mughal gardens, and snow-capped Himalayan peaks.", "hero_image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d"},
    {"id": "sikkim", "name": "Sikkim", "code": "SK", "region": "North-Eastern India", "description": "Himalayan Buddhist sanctum surrounded by Kanchenjunga peaks and ancient monasteries.", "hero_image_url": "https://images.unsplash.com/photo-1617854818583-09e7f077a156"}
]

cities = [
    {"id": "mumbai", "state_id": "maharashtra", "name": "Mumbai", "district": "Mumbai City", "latitude": 18.9431, "longitude": 72.8230, "description": "The City of Dreams, financial capital, and gateway to Western India heritage.", "hero_image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", "popular_rank": 1},
    {"id": "pune", "state_id": "maharashtra", "name": "Pune", "district": "Pune", "latitude": 18.5204, "longitude": 73.8567, "description": "Cultural capital of Maharashtra with historic Maratha citadels and palace museums.", "hero_image_url": "https://images.unsplash.com/photo-1584646098378-0874589d76b1", "popular_rank": 8},
    {"id": "jaipur", "state_id": "rajasthan", "name": "Jaipur", "district": "Jaipur", "latitude": 26.9124, "longitude": 75.7873, "description": "The Pink City, showcasing royal Rajput forts, celestial observatories, and palaces.", "hero_image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41", "popular_rank": 2},
    {"id": "udaipur", "state_id": "rajasthan", "name": "Udaipur", "district": "Udaipur", "latitude": 24.5854, "longitude": 73.7125, "description": "City of Lakes, renowned for romantic marble palaces and lakeside ghats.", "hero_image_url": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10", "popular_rank": 7},
    {"id": "delhi", "state_id": "delhi", "name": "New Delhi", "district": "New Delhi", "latitude": 28.6139, "longitude": 77.2090, "description": "Historic national capital filled with UNESCO World Heritage monuments.", "hero_image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5", "popular_rank": 3},
    {"id": "agra", "state_id": "uttar-pradesh", "name": "Agra", "district": "Agra", "latitude": 27.1767, "longitude": 78.0081, "description": "Home to the iconic Taj Mahal, Agra Fort, and imperial Mughal architecture.", "hero_image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523", "popular_rank": 4},
    {"id": "varanasi", "state_id": "uttar-pradesh", "name": "Varanasi", "district": "Varanasi", "latitude": 25.3176, "longitude": 82.9739, "description": "One of the world's oldest continuously inhabited cities on the sacred banks of the Ganges.", "hero_image_url": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc", "popular_rank": 9},
    {"id": "kochi", "state_id": "kerala", "name": "Kochi", "district": "Ernakulam", "latitude": 9.9312, "longitude": 76.2673, "description": "Historic spice trading port blending Portuguese, Dutch, British, and indigenous culture.", "hero_image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", "popular_rank": 5},
    {"id": "munnar", "state_id": "kerala", "name": "Munnar", "district": "Idukki", "latitude": 10.0889, "longitude": 77.0595, "description": "Serene hill station enveloped by rolling tea plantations and mist-covered valleys.", "hero_image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2", "popular_rank": 11},
    {"id": "goa", "state_id": "goa", "name": "Panaji & Coastal Goa", "district": "North Goa", "latitude": 15.4909, "longitude": 73.8278, "description": "Charming colonial Latin quarters, 16th-century cathedrals, and coastal defense forts.", "hero_image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", "popular_rank": 6},
    {"id": "bengaluru", "state_id": "karnataka", "name": "Bengaluru", "district": "Bengaluru Urban", "latitude": 12.9716, "longitude": 77.5946, "description": "The Garden City and technology hub, with Tudor-style palaces and sprawling botanical gardens.", "hero_image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2", "popular_rank": 10},
    {"id": "hampi", "state_id": "karnataka", "name": "Hampi", "district": "Vijayanagara", "latitude": 15.3350, "longitude": 76.4600, "description": "UNESCO World Heritage boulder-strewn landscape with grand 14th-century Vijayanagara ruins.", "hero_image_url": "https://images.unsplash.com/photo-1600100397608-f010e422a59e", "popular_rank": 12},
    {"id": "hyderabad", "state_id": "telangana", "name": "Hyderabad", "district": "Hyderabad", "latitude": 17.3850, "longitude": 78.4867, "description": "City of Pearls, famous for Charminar, Golconda Fort acoustic marvels, and royal cuisine.", "hero_image_url": "https://images.unsplash.com/photo-1616198814651-e71f960c3180", "popular_rank": 13},
    {"id": "kolkata", "state_id": "west-bengal", "name": "Kolkata", "district": "Kolkata", "latitude": 22.5726, "longitude": 88.3639, "description": "City of Joy, featuring grand colonial architecture, vibrant tramways, and historic river ghats.", "hero_image_url": "https://images.unsplash.com/photo-1558431382-27e303142255", "popular_rank": 14},
    {"id": "amritsar", "state_id": "punjab", "name": "Amritsar", "district": "Amritsar", "latitude": 31.6340, "longitude": 74.8723, "description": "Spiritual sanctum of the Sikh faith with the magnificent Golden Temple and sacred sarovar.", "hero_image_url": "https://images.unsplash.com/photo-1588096344356-9b634839cf9e", "popular_rank": 15},
    {"id": "srinagar", "state_id": "jammu-kashmir", "name": "Srinagar", "district": "Srinagar", "latitude": 34.0837, "longitude": 74.7973, "description": "Jewel of Kashmir with Dal Lake shikaras, floating gardens, and royal Mughal terraces.", "hero_image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d", "popular_rank": 16},
    {"id": "gangtok", "state_id": "sikkim", "name": "Gangtok", "district": "East Sikkim", "latitude": 27.3389, "longitude": 88.6065, "description": "Pristine Himalayan town offering breathtaking views of Mt. Kanchenjunga and monasteries.", "hero_image_url": "https://images.unsplash.com/photo-1617854818583-09e7f077a156", "popular_rank": 17}
]

places = [
    # --- MUMBAI (6) ---
    {
        "id": "gateway-of-india", "city_id": "mumbai", "state_id": "maharashtra", "name": "Gateway of India", "slug": "gateway-of-india",
        "category": "heritage", "sub_category": "monument",
        "description": "An iconic 26-meter basalt arch monument erected to commemorate the landing of King George V and Queen Mary in 1911. Overlooking the Arabian Sea, it represents Indo-Saracenic architecture with intricate Gujarati latticework.",
        "short_description": "Iconic 26m basalt arch monument facing Mumbai Harbour.",
        "latitude": 18.9220, "longitude": 72.8347, "address": "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Candidate / Buffer Zone", "historical_period": "British Raj (1911–1924)",
        "best_time_to_visit": "October to March (Early morning or sunset)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-22-2284-1877", "email": "tourism@maharashtratourism.gov.in"}, "website": "https://www.maharashtratourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f", "https://images.unsplash.com/photo-1567157577867-05ccb1388e66"],
        "video_urls": ["https://assets.mixkit.co/videos/preview/mixkit-gateway-of-india-in-mumbai-42867-large.mp4"],
        "three_d_model_url": "/models/gateway_of_india.glb",
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 4, "elevator_available": False, "notes": "Ramps available along the main waterfront promenade."},
        "source": "Maharashtra Tourism Development Corporation (MTDC)", "source_url": "https://www.maharashtratourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "marine-drive", "city_id": "mumbai", "state_id": "maharashtra", "name": "Marine Drive", "slug": "marine-drive",
        "category": "coastal", "sub_category": "promenade",
        "description": "A 3.6-kilometer arc-shaped boulevard along the Arabian Sea coast, famously nicknamed Queen's Necklace due to its glittering arc of streetlights at night. Lined with Art Deco heritage buildings recognized by UNESCO.",
        "short_description": "Scenic 3.6 km seaside promenade known as Queen's Necklace.",
        "latitude": 18.9431, "longitude": 72.8230, "address": "Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra 400020",
        "heritage_status": "Victorian Gothic & Art Deco Ensemble (UNESCO World Heritage Site)", "unesco_status": "UNESCO World Heritage Site (2018)", "historical_period": "1920–1940",
        "best_time_to_visit": "October to March (Evenings for sunset & sea breeze)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-22-2284-1877"}, "website": "https://www.maharashtratourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1567157577867-05ccb1388e66"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Completely paved wide footpath suitable for wheelchairs and strollers."},
        "source": "MTDC / UNESCO", "source_url": "https://whc.unesco.org/en/list/1480", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "chhatrapati-shivaji-terminus", "city_id": "mumbai", "state_id": "maharashtra", "name": "Chhatrapati Shivaji Maharaj Terminus", "slug": "chhatrapati-shivaji-terminus",
        "category": "heritage", "sub_category": "architecture",
        "description": "An outstanding example of Victorian Gothic Revival architecture in India, blended with themes deriving from Indian traditional architecture. Designed by Frederick William Stevens and completed in 1888.",
        "short_description": "UNESCO World Heritage Victorian Gothic railway headquarters.",
        "latitude": 18.9400, "longitude": 72.8353, "address": "DN Road, Fort, Mumbai, Maharashtra 400001",
        "heritage_status": "UNESCO World Heritage Site (2004)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Victorian Era (1878–1888)",
        "best_time_to_visit": "All year round (Evenings for exterior architectural illumination)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-22-2262-1234"}, "website": "https://cr.indianrailways.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 6, "elevator_available": True, "notes": "Ramps and elevators operational at Main Line concourse."},
        "source": "Indian Railways / UNESCO", "source_url": "https://whc.unesco.org/en/list/945", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "elephanta-caves", "city_id": "mumbai", "state_id": "maharashtra", "name": "Elephanta Caves", "slug": "elephanta-caves",
        "category": "heritage", "sub_category": "caves",
        "description": "UNESCO World Heritage rock-cut cave temples dating from 5th to 7th century AD dedicated to Lord Shiva, featuring the monumental 20-foot high Trimurti sculpture portraying Sadashiva.",
        "short_description": "Ancient UNESCO rock-cut cave temples on Gharapuri Island.",
        "latitude": 18.9633, "longitude": 72.9315, "address": "Gharapuri Island, Raigad District (Ferry from Gateway of India), Maharashtra 400001",
        "heritage_status": "UNESCO World Heritage Site (1987)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Rashtrakuta & Kalachuri Dynasties (5th–8th Century AD)",
        "best_time_to_visit": "November to March (Ferry closed during heavy monsoon)",
        "opening_hours": {"monday": "Closed", "tuesday": "09:00 - 17:30", "wednesday": "09:00 - 17:30", "thursday": "09:00 - 17:30", "friday": "09:00 - 17:30", "saturday": "09:00 - 17:30", "sunday": "09:00 - 17:30"},
        "entry_fee_inr": {"indian": 40, "foreigner": 600, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-22-2284-1877"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1609137144813-7d9921338f24"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 120, "elevator_available": False, "notes": "Steps leading up the hill; palanquin (doli) service available for elderly."},
        "source": "Archaeological Survey of India (ASI)", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "kanheri-caves", "city_id": "mumbai", "state_id": "maharashtra", "name": "Kanheri Caves", "slug": "kanheri-caves",
        "category": "nature", "sub_category": "caves",
        "description": "A group of 109 Buddhist rock-cut monuments chiselled out of massive basaltic rock inside the lush forests of Sanjay Gandhi National Park, dating from 1st century BCE to 10th century CE.",
        "short_description": "109 rock-cut Buddhist caves inside Sanjay Gandhi National Park.",
        "latitude": 19.2057, "longitude": 72.9067, "address": "Sanjay Gandhi National Park, Borivali East, Mumbai, Maharashtra 400066",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Candidate", "historical_period": "Maurya to Rashtrakuta Period (1st BCE–10th CE)",
        "best_time_to_visit": "July to February (Monsoon reveals cascading waterfalls)",
        "opening_hours": {"monday": "Closed", "tuesday": "09:00 - 17:00", "wednesday": "09:00 - 17:00", "thursday": "09:00 - 17:00", "friday": "09:00 - 17:00", "saturday": "09:00 - 17:00", "sunday": "09:00 - 17:00"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 150,
        "contact_info": {"phone": "+91-22-2886-0362"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 80, "elevator_available": False, "notes": "Forest trails and carved stone steps."},
        "source": "ASI / Forest Department", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "siddhivinayak-temple", "city_id": "mumbai", "state_id": "maharashtra", "name": "Shree Siddhivinayak Temple", "slug": "siddhivinayak-temple",
        "category": "spiritual", "sub_category": "temple",
        "description": "Historic Hindu temple dedicated to Lord Ganesha, consecrated in 1801. Known for its gold-plated sanctum dome and revered as one of the richest and most visited pilgrimage sites in India.",
        "short_description": "Revered 19th-century Ganesha temple in Prabhadevi.",
        "latitude": 19.0169, "longitude": 72.8304, "address": "SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
        "heritage_status": "State Heritage Monument", "unesco_status": "None", "historical_period": "1801",
        "best_time_to_visit": "All year round (Early morning 06:00 to avoid queues)",
        "opening_hours": {"monday": "05:30 - 22:00", "tuesday": "03:15 - 22:00", "wednesday": "05:30 - 22:00", "thursday": "05:30 - 22:00", "friday": "05:30 - 22:00", "saturday": "05:30 - 22:00", "sunday": "05:30 - 22:00"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-22-2422-3206"}, "website": "https://www.siddhivinayak.org",
        "image_urls": ["https://images.unsplash.com/photo-1567157577867-05ccb1388e66"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": True, "notes": "Special priority queues and wheelchair access ramps available."},
        "source": "Shree Siddhivinayak Temple Trust", "source_url": "https://www.siddhivinayak.org", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- PUNE (3) ---
    {
        "id": "shaniwar-wada", "city_id": "pune", "state_id": "maharashtra", "name": "Shaniwar Wada", "slug": "shaniwar-wada",
        "category": "heritage", "sub_category": "fort",
        "description": "Historical 7-storey stone fortified palace of the Maratha Peshwas built in 1732 by Peshwa Baji Rao I. Famous for the massive Dilli Darwaza with iron spikes and scenic fountain gardens.",
        "short_description": "18th-century Maratha Peshwa fortification and seat of power.",
        "latitude": 18.5196, "longitude": 73.8553, "address": "Shaniwar Peth, Pune, Maharashtra 411030",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Candidate", "historical_period": "Peshwa Era (1732)",
        "best_time_to_visit": "October to March (Evenings for light & sound show)",
        "opening_hours": {"monday": "09:30 - 17:30", "tuesday": "09:30 - 17:30", "wednesday": "09:30 - 17:30", "thursday": "09:30 - 17:30", "friday": "09:30 - 17:30", "saturday": "09:30 - 17:30", "sunday": "09:30 - 17:30"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 75,
        "contact_info": {"phone": "+91-20-2445-9333"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1584646098378-0874589d76b1"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 8, "elevator_available": False, "notes": "Paved courtyard accessible via ground level ramp."},
        "source": "ASI", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "aga-khan-palace", "city_id": "pune", "state_id": "maharashtra", "name": "Aga Khan Palace", "slug": "aga-khan-palace",
        "category": "heritage", "sub_category": "palace",
        "description": "Majestic Italian-arched palace built in 1892 by Sultan Muhammed Shah Aga Khan III. Served as the prison for Mahatma Gandhi, Kasturba Gandhi, and Sarojini Naidu during the Quit India Movement in 1942.",
        "short_description": "Italianate palace museum closely tied to India's freedom struggle.",
        "latitude": 18.5524, "longitude": 73.9015, "address": "Nagar Road, Samrat Ashok Nagar, Kalyani Nagar, Pune, Maharashtra 411006",
        "heritage_status": "Monument of National Importance (ASI)", "unesco_status": "None", "historical_period": "1892",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "09:00 - 17:30", "tuesday": "09:00 - 17:30", "wednesday": "09:00 - 17:30", "thursday": "09:00 - 17:30", "friday": "09:00 - 17:30", "saturday": "09:00 - 17:30", "sunday": "09:00 - 17:30"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-20-2668-0250"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 3, "elevator_available": False, "notes": "Spacious gardens with flat asphalt walking paths."},
        "source": "ASI", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "sinhagad-fort", "city_id": "pune", "state_id": "maharashtra", "name": "Sinhagad Fort", "slug": "sinhagad-fort",
        "category": "nature", "sub_category": "fort",
        "description": "Hill fortress located 30 km southwest of Pune perched at 1,312 meters above sea level. Site of the legendary 1670 Battle of Sinhagad fought by Tanaji Malusare.",
        "short_description": "Historic Sahyadri mountain citadel offering panoramic valley views.",
        "latitude": 18.3664, "longitude": 73.7558, "address": "Sinhagad Ghat Road, Thoptewadi, Maharashtra 411025",
        "heritage_status": "Protected State Monument", "unesco_status": "Part of Serial Nomination of Maratha Military Landscapes", "historical_period": "Circa 1300–1670",
        "best_time_to_visit": "June to February (Monsoon brings mist and waterfalls)",
        "opening_hours": {"monday": "06:00 - 18:00", "tuesday": "06:00 - 18:00", "wednesday": "06:00 - 18:00", "thursday": "06:00 - 18:00", "friday": "06:00 - 18:00", "saturday": "06:00 - 18:00", "sunday": "06:00 - 18:00"},
        "entry_fee_inr": {"indian": 50, "foreigner": 100, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-20-2445-9333"}, "website": "https://www.maharashtratourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1584646098378-0874589d76b1"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 150, "elevator_available": False, "notes": "Rugged hill terrain; trekking pathway."},
        "source": "Maharashtra Forest & Tourism Department", "source_url": "https://www.maharashtratourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- JAIPUR (4) ---
    {
        "id": "hawa-mahal", "city_id": "jaipur", "state_id": "rajasthan", "name": "Hawa Mahal (Palace of Winds)", "slug": "hawa-mahal",
        "category": "heritage", "sub_category": "palace",
        "description": "Five-storey pink and red sandstone palace built in 1799 by Maharaja Sawai Pratap Singh. Features 953 intricately carved jharokhas (small casements) designed like Lord Krishna's crown to allow royal women to observe street festivals unseen.",
        "short_description": "Iconic 1799 pink sandstone facade with 953 lattice windows.",
        "latitude": 26.9239, "longitude": 75.8267, "address": "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002",
        "heritage_status": "State Protected Monument / UNESCO Jaipur City Ensemble", "unesco_status": "Part of Jaipur Walled City UNESCO Site (2019)", "historical_period": "1799",
        "best_time_to_visit": "October to March (Morning sun enhances the sandstone hues)",
        "opening_hours": {"monday": "09:00 - 17:00", "tuesday": "09:00 - 17:00", "wednesday": "09:00 - 17:00", "thursday": "09:00 - 17:00", "friday": "09:00 - 17:00", "saturday": "09:00 - 17:00", "sunday": "09:00 - 17:00"},
        "entry_fee_inr": {"indian": 50, "foreigner": 200, "child": 0}, "estimated_visit_duration_min": 75,
        "contact_info": {"phone": "+91-141-261-8862"}, "website": "https://www.tourism.rajasthan.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 60, "elevator_available": False, "notes": "Ramps inside upper floors instead of stairs, but entry has steps."},
        "source": "Rajasthan Tourism", "source_url": "https://www.tourism.rajasthan.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "amber-fort", "city_id": "jaipur", "state_id": "rajasthan", "name": "Amber Fort & Palace", "slug": "amber-fort",
        "category": "heritage", "sub_category": "fort",
        "description": "Massive hill fort crafted from yellow and pink sandstone and white marble. Highlights include the Sheesh Mahal (Mirror Palace), Diwan-e-Aam, and panoramic views of Maota Lake.",
        "short_description": "UNESCO World Heritage hilltop palace with shimmering mirror hall.",
        "latitude": 26.9855, "longitude": 75.8513, "address": "Devisinghpura, Amer, Jaipur, Rajasthan 302001",
        "heritage_status": "UNESCO World Heritage Site (Hill Forts of Rajasthan)", "unesco_status": "UNESCO World Heritage Site (2013)", "historical_period": "Rajput Era (1592)",
        "best_time_to_visit": "October to March (Early morning or evening sound & light show)",
        "opening_hours": {"monday": "08:00 - 17:30", "tuesday": "08:00 - 17:30", "wednesday": "08:00 - 17:30", "thursday": "08:00 - 17:30", "friday": "08:00 - 17:30", "saturday": "08:00 - 17:30", "sunday": "08:00 - 17:30"},
        "entry_fee_inr": {"indian": 100, "foreigner": 550, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-141-253-0264"}, "website": "https://www.tourism.rajasthan.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 30, "elevator_available": False, "notes": "Jeep / battery operated vehicle shuttle available to top courtyards."},
        "source": "UNESCO / Rajasthan Tourism", "source_url": "https://whc.unesco.org/en/list/247", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "city-palace-jaipur", "city_id": "jaipur", "state_id": "rajasthan", "name": "City Palace Jaipur", "slug": "city-palace-jaipur",
        "category": "heritage", "sub_category": "palace",
        "description": "A magnificent royal complex blending Rajput, Mughal, and European architectural styles. Established in 1727 by Maharaja Sawai Jai Singh II, featuring the Chandra Mahal, Mubarak Mahal, and museum galleries.",
        "short_description": "Regal complex with peacock courtyards, armouries, and royal museums.",
        "latitude": 26.9258, "longitude": 75.8236, "address": "Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
        "heritage_status": "Private Trust Heritage Complex", "unesco_status": "Part of Jaipur Walled City", "historical_period": "1727–1732",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "09:30 - 17:00", "tuesday": "09:30 - 17:00", "wednesday": "09:30 - 17:00", "thursday": "09:30 - 17:00", "friday": "09:30 - 17:00", "saturday": "09:30 - 17:00", "sunday": "09:30 - 17:00"},
        "entry_fee_inr": {"indian": 200, "foreigner": 700, "child": 100}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-141-408-8888"}, "website": "https://royaljaipur.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": True, "notes": "Wheelchair ramps throughout the main courtyards."},
        "source": "MSMS II Museum Trust", "source_url": "https://royaljaipur.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "jantar-mantar-jaipur", "city_id": "jaipur", "state_id": "rajasthan", "name": "Jantar Mantar Observatory", "slug": "jantar-mantar-jaipur",
        "category": "heritage", "sub_category": "observatory",
        "description": "Collection of nineteen architectural astronomical instruments built by the Rajput king Sawai Jai Singh II and completed in 1734. Features the world's largest stone sundial, the Vrihat Samrat Yantra.",
        "short_description": "UNESCO World Heritage 18th-century stone astronomical observatory.",
        "latitude": 26.9248, "longitude": 75.8246, "address": "Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
        "heritage_status": "UNESCO World Heritage Site (2010)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "1734",
        "best_time_to_visit": "Midday (To observe solar shadow movements on astronomical dials)",
        "opening_hours": {"monday": "09:00 - 17:00", "tuesday": "09:00 - 17:00", "wednesday": "09:00 - 17:00", "thursday": "09:00 - 17:00", "friday": "09:00 - 17:00", "saturday": "09:00 - 17:00", "sunday": "09:00 - 17:00"},
        "entry_fee_inr": {"indian": 50, "foreigner": 200, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-141-261-0494"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Flat stone paved pathways connecting all major instruments."},
        "source": "UNESCO / ASI", "source_url": "https://whc.unesco.org/en/list/1338", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- UDAIPUR (2) ---
    {
        "id": "city-palace-udaipur", "city_id": "udaipur", "state_id": "rajasthan", "name": "City Palace Udaipur", "slug": "city-palace-udaipur",
        "category": "heritage", "sub_category": "palace",
        "description": "Colossal lakeside palace complex built over nearly 400 years by the rulers of the Mewar dynasty on the eastern banks of Lake Pichola. Notable for its ornate balconies, mirror mosaics, and vintage crystal gallery.",
        "short_description": "Grand 400-year-old Mewar dynasty marble palace on Lake Pichola.",
        "latitude": 24.5764, "longitude": 73.6835, "address": "Old City, Udaipur, Rajasthan 313001",
        "heritage_status": "Royal Mewar Trust Heritage Complex", "unesco_status": "Candidate", "historical_period": "1559–Present",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "09:30 - 17:30", "tuesday": "09:30 - 17:30", "wednesday": "09:30 - 17:30", "thursday": "09:30 - 17:30", "friday": "09:30 - 17:30", "saturday": "09:30 - 17:30", "sunday": "09:30 - 17:30"},
        "entry_fee_inr": {"indian": 300, "foreigner": 300, "child": 100}, "estimated_visit_duration_min": 150,
        "contact_info": {"phone": "+91-294-241-9021"}, "website": "https://www.eternalmewar.in",
        "image_urls": ["https://images.unsplash.com/photo-1615836245337-f5b9b2303f10"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 80, "elevator_available": False, "notes": "Multiple levels with historic stone steps; ground courtyards accessible."},
        "source": "Maharana of Mewar Charitable Foundation", "source_url": "https://www.eternalmewar.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "lake-pichola", "city_id": "udaipur", "state_id": "rajasthan", "name": "Lake Pichola & Jag Mandir", "slug": "lake-pichola",
        "category": "nature", "sub_category": "lake",
        "description": "An artificial freshwater lake created in the year 1362 AD. Features island palaces including the Lake Palace (Taj Lake Palace) and Jag Mandir, set against the backdrop of the Aravalli hills.",
        "short_description": "Scenic 14th-century freshwater lake surrounded by royal marble palaces.",
        "latitude": 24.5714, "longitude": 73.6738, "address": "Rameshwar Ghat, City Palace Complex, Udaipur, Rajasthan 313001",
        "heritage_status": "State Heritage Water Body", "unesco_status": "None", "historical_period": "1362 AD",
        "best_time_to_visit": "October to March (Sunset boat rides)",
        "opening_hours": {"monday": "09:00 - 18:00", "tuesday": "09:00 - 18:00", "wednesday": "09:00 - 18:00", "thursday": "09:00 - 18:00", "friday": "09:00 - 18:00", "saturday": "09:00 - 18:00", "sunday": "09:00 - 18:00"},
        "entry_fee_inr": {"indian": 400, "foreigner": 800, "child": 200}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-294-241-9021"}, "website": "https://www.tourism.rajasthan.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1615836245337-f5b9b2303f10"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 6, "elevator_available": False, "notes": "Boats have ramp access from City Palace jetty."},
        "source": "Rajasthan Tourism", "source_url": "https://www.tourism.rajasthan.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- DELHI (4) ---
    {
        "id": "red-fort-delhi", "city_id": "delhi", "state_id": "delhi", "name": "Red Fort (Lal Qila)", "slug": "red-fort-delhi",
        "category": "heritage", "sub_category": "fort",
        "description": "Historic red sandstone fortress constructed in 1639 by the fifth Mughal Emperor Shah Jahan as the palace of his fortified capital Shahjahanabad. Known for its massive ramparts, Lahori Gate, and the Diwan-i-Khas.",
        "short_description": "UNESCO World Heritage Mughal imperial palace citadel in Old Delhi.",
        "latitude": 28.6562, "longitude": 77.2410, "address": "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
        "heritage_status": "UNESCO World Heritage Site (2007)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Mughal Empire (1639–1648)",
        "best_time_to_visit": "October to March (Mornings or evening sound & light)",
        "opening_hours": {"monday": "Closed", "tuesday": "09:30 - 16:30", "wednesday": "09:30 - 16:30", "thursday": "09:30 - 16:30", "friday": "09:30 - 16:30", "saturday": "09:30 - 16:30", "sunday": "09:30 - 16:30"},
        "entry_fee_inr": {"indian": 35, "foreigner": 550, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-11-2327-7705"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1587474260584-136574528ed5"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Electric golf carts available from outer entrance to main gate."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/231", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "qutub-minar", "city_id": "delhi", "state_id": "delhi", "name": "Qutub Minar & Complex", "slug": "qutub-minar",
        "category": "heritage", "sub_category": "monument",
        "description": "A 72.5-meter tapering fluted red sandstone minaret built in 1192 by Qutb-ud-din Aibak. The complex contains the ancient 4th-century rust-resistant Iron Pillar of Chandragupta II and Quwwat-ul-Islam Mosque.",
        "short_description": "World's tallest brick minaret and UNESCO medieval monument complex.",
        "latitude": 28.5245, "longitude": 77.1855, "address": "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
        "heritage_status": "UNESCO World Heritage Site (1993)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Delhi Sultanate (1192–1220)",
        "best_time_to_visit": "October to March (Late afternoon light)",
        "opening_hours": {"monday": "07:00 - 17:00", "tuesday": "07:00 - 17:00", "wednesday": "07:00 - 17:00", "thursday": "07:00 - 17:00", "friday": "07:00 - 17:00", "saturday": "07:00 - 17:00", "sunday": "07:00 - 17:00"},
        "entry_fee_inr": {"indian": 35, "foreigner": 550, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-11-2664-3856"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1587474260584-136574528ed5"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Paved pathways surround all major ruins in the garden complex."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/233", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "humayuns-tomb", "city_id": "delhi", "state_id": "delhi", "name": "Humayun's Tomb", "slug": "humayuns-tomb",
        "category": "heritage", "sub_category": "tomb",
        "description": "Splendid garden tomb built in 1570 by Empress Bega Begum for Mughal Emperor Humayun. Regarded as the architectural precursor and inspiration for the Taj Mahal, surrounded by formal Persian Charbagh gardens.",
        "short_description": "UNESCO World Heritage Mughal garden tomb and precursor to the Taj Mahal.",
        "latitude": 28.5933, "longitude": 77.2507, "address": "Mathura Rd, Nizamuddin East, New Delhi, Delhi 110013",
        "heritage_status": "UNESCO World Heritage Site (1993)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Mughal Era (1565–1572)",
        "best_time_to_visit": "October to March (Sunset golden hour)",
        "opening_hours": {"monday": "06:00 - 18:00", "tuesday": "06:00 - 18:00", "wednesday": "06:00 - 18:00", "thursday": "06:00 - 18:00", "friday": "06:00 - 18:00", "saturday": "06:00 - 18:00", "sunday": "06:00 - 18:00"},
        "entry_fee_inr": {"indian": 35, "foreigner": 550, "child": 0}, "estimated_visit_duration_min": 100,
        "contact_info": {"phone": "+91-11-2464-7008"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1587474260584-136574528ed5"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 12, "elevator_available": False, "notes": "Ramps lead up to the plinth; gardens are universally accessible."},
        "source": "ASI / Aga Khan Trust for Culture", "source_url": "https://whc.unesco.org/en/list/232", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "india-gate", "city_id": "delhi", "state_id": "delhi", "name": "India Gate & Kartavya Path", "slug": "india-gate",
        "category": "heritage", "sub_category": "memorial",
        "description": "A 42-meter high triumphal arch war memorial designed by Sir Edwin Lutyens and completed in 1931. Commemorates 84,000 soldiers of the British Indian Army who fell during World War I and Anglo-Afghan wars.",
        "short_description": "National triumphal arch memorial and ceremonial avenue.",
        "latitude": 28.6129, "longitude": 77.2295, "address": "Kartavya Path, India Gate, New Delhi, Delhi 110001",
        "heritage_status": "National War Memorial Zone", "unesco_status": "None", "historical_period": "1921–1931",
        "best_time_to_visit": "Evenings (Pleasant breezes and floodlit lawns)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-11-2336-5358"}, "website": "https://delhitourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1587474260584-136574528ed5"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Full pedestrian plaza with paved underpasses and wheelchair ramps."},
        "source": "Delhi Tourism", "source_url": "https://delhitourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- AGRA (2) ---
    {
        "id": "taj-mahal", "city_id": "agra", "state_id": "uttar-pradesh", "name": "Taj Mahal", "slug": "taj-mahal",
        "category": "heritage", "sub_category": "mausoleum",
        "description": "An immense ivory-white marble mausoleum on the south bank of the Yamuna river, commissioned in 1631 by Mughal Emperor Shah Jahan for his favorite wife Mumtaz Mahal. A universal jewel of Muslim art in India and one of the New 7 Wonders of the World.",
        "short_description": "UNESCO World Heritage masterpiece and New 7 Wonder of the World.",
        "latitude": 27.1751, "longitude": 78.0421, "address": "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
        "heritage_status": "UNESCO World Heritage Site (1983) / New 7 Wonder", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Mughal Empire (1631–1648)",
        "best_time_to_visit": "October to March (Sunrise for soft pink and golden hues)",
        "opening_hours": {"monday": "06:00 - 18:30", "tuesday": "06:00 - 18:30", "wednesday": "06:00 - 18:30", "thursday": "06:00 - 18:30", "friday": "Closed", "saturday": "06:00 - 18:30", "sunday": "06:00 - 18:30"},
        "entry_fee_inr": {"indian": 50, "foreigner": 1100, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-562-222-6431"}, "website": "https://www.tajmahal.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1564507592333-c60657eea523"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 10, "elevator_available": False, "notes": "Electric vehicles transport visitors from parking; ramps available to plinth."},
        "source": "Archaeological Survey of India (ASI)", "source_url": "https://www.tajmahal.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "agra-fort", "city_id": "agra", "state_id": "uttar-pradesh", "name": "Agra Fort", "slug": "agra-fort",
        "category": "heritage", "sub_category": "fort",
        "description": "Historical 16th-century fortress of red sandstone in the city of Agra. Served as the main residence of the emperors of the Mughal Dynasty until 1638. Highlights include Jahangiri Mahal, Khas Mahal, and Musamman Burj.",
        "short_description": "UNESCO World Heritage red sandstone citadel of Mughal emperors.",
        "latitude": 27.1795, "longitude": 78.0211, "address": "Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003",
        "heritage_status": "UNESCO World Heritage Site (1983)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Mughal Era (1565–1573)",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "06:00 - 18:00", "tuesday": "06:00 - 18:00", "wednesday": "06:00 - 18:00", "thursday": "06:00 - 18:00", "friday": "06:00 - 18:00", "saturday": "06:00 - 18:00", "sunday": "06:00 - 18:00"},
        "entry_fee_inr": {"indian": 50, "foreigner": 650, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-562-222-6431"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1564507592333-c60657eea523"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 8, "elevator_available": False, "notes": "Ramps available through Amar Singh Gate to courtyards."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/251", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- VARANASI (2) ---
    {
        "id": "kashi-vishwanath", "city_id": "varanasi", "state_id": "uttar-pradesh", "name": "Kashi Vishwanath Temple & Corridor", "slug": "kashi-vishwanath",
        "category": "spiritual", "sub_category": "temple",
        "description": "One of the most sacred Hindu temples dedicated to Lord Shiva, home to the sacred Jyotirlinga of Vishweshwara. Rebuilt by Ahilyabai Holkar in 1780 and newly expanded via the Kashi Vishwanath Dham corridor.",
        "short_description": "Holiest Jyotirlinga shrine on the banks of the sacred Ganges River.",
        "latitude": 25.3109, "longitude": 83.0107, "address": "Lahori Tola, Varanasi, Uttar Pradesh 221001",
        "heritage_status": "Protected State Sacred Monument", "unesco_status": "Part of Varanasi Heritage Tentative List", "historical_period": "1780 (Ahilyabai Holkar)",
        "best_time_to_visit": "October to March (Mangala Aarti at 03:00 or evening)",
        "opening_hours": {"monday": "03:00 - 23:00", "tuesday": "03:00 - 23:00", "wednesday": "03:00 - 23:00", "thursday": "03:00 - 23:00", "friday": "03:00 - 23:00", "saturday": "03:00 - 23:00", "sunday": "03:00 - 23:00"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-542-239-2629"}, "website": "https://www.shrikashivishwanath.org",
        "image_urls": ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": True, "notes": "New corridor features escalators, travelators, and smooth granite ramps from ghats."},
        "source": "Shri Kashi Vishwanath Mandir Trust", "source_url": "https://www.shrikashivishwanath.org", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "dashashwamedh-ghat", "city_id": "varanasi", "state_id": "uttar-pradesh", "name": "Dashashwamedh Ghat (Ganga Aarti)", "slug": "dashashwamedh-ghat",
        "category": "spiritual", "sub_category": "ghat",
        "description": "The main and most historic ghat on the Ganga river in Varanasi. Famous worldwide for the synchronized evening Maha Ganga Aarti performed with brass lamps, conch shells, and incense by priests.",
        "short_description": "Ancient sacred river ghat celebrated for the evening Ganga Aarti.",
        "latitude": 25.3075, "longitude": 83.0104, "address": "Dashashwamedh Ghat Rd, Bangali Tola, Varanasi, Uttar Pradesh 221001",
        "heritage_status": "Living Heritage Cultural Site", "unesco_status": "Tentative List", "historical_period": "Ancient (Rebuilt 1748)",
        "best_time_to_visit": "October to March (18:00 for the Grand Evening Aarti)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-542-250-5033"}, "website": "https://uptourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 45, "elevator_available": False, "notes": "Stone stairs down to river; boat boarding requires assistance."},
        "source": "UP Tourism", "source_url": "https://uptourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- KOCHI (2) ---
    {
        "id": "fort-kochi-chinese-nets", "city_id": "kochi", "state_id": "kerala", "name": "Fort Kochi & Chinese Fishing Nets", "slug": "fort-kochi-chinese-nets",
        "category": "coastal", "sub_category": "heritage",
        "description": "Cantilevered shore-operated fishing lift nets established by Chinese traders in the 14th century, set along the historic colonial promenade of Fort Kochi featuring St. Francis Church and Vasco House.",
        "short_description": "14th-century cantilevered fishing nets and historic colonial port.",
        "latitude": 9.9674, "longitude": 76.2429, "address": "River Rd, Fort Kochi, Kochi, Kerala 682001",
        "heritage_status": "State Heritage Maritime Zone", "unesco_status": "Candidate", "historical_period": "14th–16th Century",
        "best_time_to_visit": "September to March (Sunset viewing)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-484-221-6533"}, "website": "https://www.keralatourism.org",
        "image_urls": ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Paved walkway along the waterfront walkway."},
        "source": "Kerala Tourism", "source_url": "https://www.keralatourism.org", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "mattancherry-palace", "city_id": "kochi", "state_id": "kerala", "name": "Mattancherry Palace (Dutch Palace)", "slug": "mattancherry-palace",
        "category": "heritage", "sub_category": "palace",
        "description": "Portuguese-built palace gifted to the King of Cochin in 1555 and later renovated by the Dutch. Renowned for its extraordinary murals depicting scenes from the Ramayana and Mahabharata in tempera technique.",
        "short_description": "16th-century palace museum famous for classical Hindu mythological murals.",
        "latitude": 9.9583, "longitude": 76.2592, "address": "Palace Rd, Mattancherry, Kochi, Kerala 682002",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "None", "historical_period": "1555",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "Closed", "tuesday": "09:45 - 13:00, 14:00 - 16:45", "wednesday": "09:45 - 13:00, 14:00 - 16:45", "thursday": "09:45 - 13:00, 14:00 - 16:45", "friday": "Closed", "saturday": "09:45 - 13:00, 14:00 - 16:45", "sunday": "09:45 - 13:00, 14:00 - 16:45"},
        "entry_fee_inr": {"indian": 5, "foreigner": 100, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-484-222-6085"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 18, "elevator_available": False, "notes": "Wooden staircase leading to first floor museum exhibits."},
        "source": "ASI", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- GOA (2) ---
    {
        "id": "basilica-bom-jesus", "city_id": "goa", "state_id": "goa", "name": "Basilica of Bom Jesus", "slug": "basilica-bom-jesus",
        "category": "heritage", "sub_category": "church",
        "description": "UNESCO World Heritage 16th-century Catholic basilica in Old Goa housing the sacred mortal remains of Saint Francis Xavier. Exemplifies Portuguese Baroque architecture with carved basaltic embellishments.",
        "short_description": "UNESCO World Heritage Baroque basilica in Old Goa holding St. Francis Xavier relic.",
        "latitude": 15.5009, "longitude": 73.9116, "address": "Old Goa Rd, Bainguinim, Goa 403402",
        "heritage_status": "UNESCO World Heritage Site (1986)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "Portuguese Era (1594–1605)",
        "best_time_to_visit": "November to February",
        "opening_hours": {"monday": "09:00 - 18:30", "tuesday": "09:00 - 18:30", "wednesday": "09:00 - 18:30", "thursday": "09:00 - 18:30", "friday": "09:00 - 18:30", "saturday": "09:00 - 18:30", "sunday": "10:30 - 18:30"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 75,
        "contact_info": {"phone": "+91-832-228-5790"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 2, "elevator_available": False, "notes": "Ramp available at side entrance into the nave."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/234", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "fort-aguada", "city_id": "goa", "state_id": "goa", "name": "Fort Aguada & Lighthouse", "slug": "fort-aguada",
        "category": "heritage", "sub_category": "fort",
        "description": "Well-preserved 17th-century Portuguese fortress and 4-storey lighthouse standing on Sinquerim Beach overlooking the confluence of Mandovi River and Arabian Sea. Constructed in 1612 to protect against Dutch fleets.",
        "short_description": "1612 Portuguese coastal fort with freshwater springs and panoramic lighthouse.",
        "latitude": 15.4925, "longitude": 73.7736, "address": "Aguada Fort Rd, Candolim, Goa 403515",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Candidate", "historical_period": "Portuguese Era (1612)",
        "best_time_to_visit": "October to March (Late afternoon for sea breeze)",
        "opening_hours": {"monday": "09:00 - 18:00", "tuesday": "09:00 - 18:00", "wednesday": "09:00 - 18:00", "thursday": "09:00 - 18:00", "friday": "09:00 - 18:00", "saturday": "09:00 - 18:00", "sunday": "09:00 - 18:00"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-832-243-8750"}, "website": "https://goatourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 10, "elevator_available": False, "notes": "Lower fort and museum ramp-equipped; upper ramparts have stone inclines."},
        "source": "Goa Tourism / ASI", "source_url": "https://goatourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- BENGALURU & HAMPI (3) ---
    {
        "id": "bangalore-palace", "city_id": "bengaluru", "state_id": "karnataka", "name": "Bangalore Palace", "slug": "bangalore-palace",
        "category": "heritage", "sub_category": "palace",
        "description": "Grand royal palace constructed in Tudor Revival style with fortified towers, battlements, and turreted battlements by Rev. J. Garrett in 1878, later purchased by the Wadiyar dynasty Maharajas of Mysore.",
        "short_description": "Tudor-style royal palace with wooden carvings and manicured lawns.",
        "latitude": 12.9988, "longitude": 77.5921, "address": "Vasanth Nagar, Bengaluru, Karnataka 560052",
        "heritage_status": "Private Wadiyar Heritage Property", "unesco_status": "None", "historical_period": "1878",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "10:00 - 17:30", "tuesday": "10:00 - 17:30", "wednesday": "10:00 - 17:30", "thursday": "10:00 - 17:30", "friday": "10:00 - 17:30", "saturday": "10:00 - 17:30", "sunday": "10:00 - 17:30"},
        "entry_fee_inr": {"indian": 250, "foreigner": 500, "child": 150}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-80-2226-2815"}, "website": "https://karnatakatourism.org",
        "image_urls": ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 4, "elevator_available": False, "notes": "Ground floor accessible via ramp."},
        "source": "Karnataka Tourism", "source_url": "https://karnatakatourism.org", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "hampi-virupaksha", "city_id": "hampi", "state_id": "karnataka", "name": "Virupaksha Temple & Hampi Bazaar", "slug": "hampi-virupaksha",
        "category": "spiritual", "sub_category": "temple",
        "description": "Part of the Group of Monuments at Hampi UNESCO site on the banks of Tungabhadra River. Dedicated to Lord Virupaksha (Shiva), active continuously since the 7th century through the golden age of the Vijayanagara Empire.",
        "short_description": "UNESCO World Heritage 7th-century Dravidian temple complex in Vijayanagara.",
        "latitude": 15.3353, "longitude": 76.4600, "address": "Hampi, Vijayanagara District, Karnataka 583239",
        "heritage_status": "UNESCO World Heritage Site (1986)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "7th Century / Vijayanagara Era (1336–1565)",
        "best_time_to_visit": "October to February",
        "opening_hours": {"monday": "06:00 - 18:00", "tuesday": "06:00 - 18:00", "wednesday": "06:00 - 18:00", "thursday": "06:00 - 18:00", "friday": "06:00 - 18:00", "saturday": "06:00 - 18:00", "sunday": "06:00 - 18:00"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-8394-241-339"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1600100397608-f010e422a59e"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 5, "elevator_available": False, "notes": "Flat stone floor courtyards."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/241", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "hampi-stone-chariot", "city_id": "hampi", "state_id": "karnataka", "name": "Vittala Temple & Stone Chariot", "slug": "hampi-stone-chariot",
        "category": "heritage", "sub_category": "monument",
        "description": "Architectural marvel of the Vijayanagara empire, featuring the iconic monolithic granite Stone Chariot dedicated to Garuda (depicted on the ₹50 banknote) and musical stone pillars in the Ranga Mandapa.",
        "short_description": "World-famous monolithic granite stone chariot and musical pillar mandapa.",
        "latitude": 15.3438, "longitude": 76.4764, "address": "Vittala Complex, Hampi, Karnataka 583239",
        "heritage_status": "UNESCO World Heritage Site (1986)", "unesco_status": "UNESCO World Heritage Site", "historical_period": "16th Century (King Devaraya II & Krishnadevaraya)",
        "best_time_to_visit": "October to February (Early morning or sunset)",
        "opening_hours": {"monday": "08:30 - 17:30", "tuesday": "08:30 - 17:30", "wednesday": "08:30 - 17:30", "thursday": "08:30 - 17:30", "friday": "08:30 - 17:30", "saturday": "08:30 - 17:30", "sunday": "08:30 - 17:30"},
        "entry_fee_inr": {"indian": 40, "foreigner": 600, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-8394-241-339"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1600100397608-f010e422a59e"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Electric buggy transport connects parking area to temple gates."},
        "source": "ASI / UNESCO", "source_url": "https://whc.unesco.org/en/list/241", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- HYDERABAD (2) ---
    {
        "id": "charminar", "city_id": "hyderabad", "state_id": "telangana", "name": "Charminar", "slug": "charminar",
        "category": "heritage", "sub_category": "monument",
        "description": "Monument and mosque built in 1591 by Muhammad Quli Qutb Shah to commemorate the eradication of plague. Its four grand arches open into the lively Laad Bazaar and Mecca Masjid.",
        "short_description": "1591 landmark four-minaret square gateway in old Hyderabad.",
        "latitude": 17.3616, "longitude": 78.4747, "address": "Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Candidate", "historical_period": "Qutb Shahi Dynasty (1591)",
        "best_time_to_visit": "October to March (Evening lighting)",
        "opening_hours": {"monday": "09:30 - 17:30", "tuesday": "09:30 - 17:30", "wednesday": "09:30 - 17:30", "thursday": "09:30 - 17:30", "friday": "09:30 - 17:30", "saturday": "09:30 - 17:30", "sunday": "09:30 - 17:30"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-40-2452-1157"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1616198814651-e71f960c3180"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Surrounding pedestrianized plaza is fully accessible."},
        "source": "ASI", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "golconda-fort", "city_id": "hyderabad", "state_id": "telangana", "name": "Golconda Fort", "slug": "golconda-fort",
        "category": "heritage", "sub_category": "fort",
        "description": "Colossal fortified citadel famous for its ingenious acoustic engineering, diamond vault mines (which produced the Koh-i-Noor and Hope Diamond), and royal palaces.",
        "short_description": "Massive granite fortress renowned for acoustic marvels and diamond vaults.",
        "latitude": 17.3833, "longitude": 78.4011, "address": "Ibrahim Bagh, Hyderabad, Telangana 500008",
        "heritage_status": "ASI Protected National Monument", "unesco_status": "Tentative List (Monuments of the Qutb Shahi Sultanate)", "historical_period": "Kakatiya & Qutb Shahi (1518–1687)",
        "best_time_to_visit": "October to March (Late afternoon or sound & light show)",
        "opening_hours": {"monday": "09:00 - 17:30", "tuesday": "09:00 - 17:30", "wednesday": "09:00 - 17:30", "thursday": "09:00 - 17:30", "friday": "09:00 - 17:30", "saturday": "09:00 - 17:30", "sunday": "09:00 - 17:30"},
        "entry_fee_inr": {"indian": 25, "foreigner": 300, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-40-2351-2401"}, "website": "https://asi.nic.in",
        "image_urls": ["https://images.unsplash.com/photo-1616198814651-e71f960c3180"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 360, "elevator_available": False, "notes": "Lower entrance gate accessible; steep uphill climb to Bala Hissar pavilion."},
        "source": "ASI", "source_url": "https://asi.nic.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- KOLKATA (2) ---
    {
        "id": "victoria-memorial", "city_id": "kolkata", "state_id": "west-bengal", "name": "Victoria Memorial Hall", "slug": "victoria-memorial",
        "category": "heritage", "sub_category": "museum",
        "description": "Large white Makrana marble monument dedicated to Queen Victoria, designed by Sir William Emerson in Indo-Saracenic revivalist style and completed in 1921. Set in 64 acres of landscaped gardens with a massive museum collection.",
        "short_description": "Grand white marble memorial hall and royal museum on the Maidan.",
        "latitude": 22.5448, "longitude": 88.3426, "address": "1 Queens Way, Maidan, Kolkata, West Bengal 700071",
        "heritage_status": "National Institution of Culture", "unesco_status": "Candidate", "historical_period": "1906–1921",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "Closed", "tuesday": "10:00 - 17:00", "wednesday": "10:00 - 17:00", "thursday": "10:00 - 17:00", "friday": "10:00 - 17:00", "saturday": "10:00 - 17:00", "sunday": "10:00 - 17:00"},
        "entry_fee_inr": {"indian": 50, "foreigner": 500, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-33-2223-1890"}, "website": "https://www.victoriamemorial-cal.org",
        "image_urls": ["https://images.unsplash.com/photo-1558431382-27e303142255"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 6, "elevator_available": True, "notes": "Wheelchair ramps at north and south entrance portals."},
        "source": "Ministry of Culture, Government of India", "source_url": "https://www.victoriamemorial-cal.org", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "howrah-bridge", "city_id": "kolkata", "state_id": "west-bengal", "name": "Howrah Bridge (Rabindra Setu)", "slug": "howrah-bridge",
        "category": "heritage", "sub_category": "bridge",
        "description": "Famous balanced cantilever truss bridge without nuts and bolts over the Hooghly River, opened in 1943. An iconic symbol of Kolkata connecting Howrah with the main city.",
        "short_description": "Iconic 1943 balanced cantilever steel bridge spanning the Hooghly River.",
        "latitude": 22.5851, "longitude": 88.3468, "address": "Howrah Bridge, Kolkata, West Bengal 700001",
        "heritage_status": "National Engineering Landmark", "unesco_status": "None", "historical_period": "1936–1943",
        "best_time_to_visit": "Early morning or evening illumination",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 45,
        "contact_info": {"phone": "+91-33-2230-3451"}, "website": "https://wbtourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1558431382-27e303142255"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Paved pedestrian footpaths along both flanks of the bridge."},
        "source": "Syama Prasad Mookerjee Port Trust", "source_url": "https://wbtourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- AMRITSAR (2) ---
    {
        "id": "golden-temple", "city_id": "amritsar", "state_id": "punjab", "name": "Golden Temple (Harmandir Sahib)", "slug": "golden-temple",
        "category": "spiritual", "sub_category": "gurdwara",
        "description": "Pre-eminent spiritual shrine of Sikhism, covered in real gold leaf and surrounded by the sacred Amrit Sarovar lake. Famous for serving free communal meals to over 100,000 pilgrims daily in the world's largest community kitchen (Langar).",
        "short_description": "Holiest gold-plated Sikh sanctum surrounded by the sacred Amrit Sarovar.",
        "latitude": 31.6200, "longitude": 74.8765, "address": "Golden Temple Rd, Atta Mandi, Amritsar, Punjab 143006",
        "heritage_status": "World Renowned Living Spiritual Heritage", "unesco_status": "Tentative List", "historical_period": "Founded 1577 (Guru Ram Das Ji)",
        "best_time_to_visit": "All year round (04:00 for Palki Sahib ceremony or evening illumination)",
        "opening_hours": {"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 180,
        "contact_info": {"phone": "+91-183-255-3957"}, "website": "https://sgpc.net",
        "image_urls": ["https://images.unsplash.com/photo-1588096344356-9b634839cf9e"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": True, "notes": "Special wheelchairs and assistants provided free by SGPC at parikrama entrance."},
        "source": "Shiromani Gurdwara Parbandhak Committee (SGPC)", "source_url": "https://sgpc.net", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "jallianwala-bagh", "city_id": "amritsar", "state_id": "punjab", "name": "Jallianwala Bagh National Memorial", "slug": "jallianwala-bagh",
        "category": "heritage", "sub_category": "memorial",
        "description": "Historic public garden and sacred national memorial commemorating peaceful protestors massacred under British colonial rule on 13 April 1919. Contains the preserved Martyrs' Well, bullet marks in brick walls, and the eternal flame.",
        "short_description": "Solemn national memorial of India's freedom struggle.",
        "latitude": 31.6206, "longitude": 74.8802, "address": "Golden Temple Rd, Amritsar, Punjab 143006",
        "heritage_status": "National Memorial of Historic Importance", "unesco_status": "None", "historical_period": "1919",
        "best_time_to_visit": "October to March",
        "opening_hours": {"monday": "06:30 - 19:30", "tuesday": "06:30 - 19:30", "wednesday": "06:30 - 19:30", "thursday": "06:30 - 19:30", "friday": "06:30 - 19:30", "saturday": "06:30 - 19:30", "sunday": "06:30 - 19:30"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 60,
        "contact_info": {"phone": "+91-183-255-7389"}, "website": "https://punjabtourism.punjab.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1588096344356-9b634839cf9e"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 0, "elevator_available": False, "notes": "Paved memorial walkway throughout."},
        "source": "Ministry of Culture / Punjab Tourism", "source_url": "https://punjabtourism.punjab.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- SRINAGAR (2) ---
    {
        "id": "dal-lake", "city_id": "srinagar", "state_id": "jammu-kashmir", "name": "Dal Lake & Shikara Promenade", "slug": "dal-lake",
        "category": "nature", "sub_category": "lake",
        "description": "Iconic urban lake in Srinagar, known as the 'Jewel in the crown of Kashmir'. Famous for ornate carved wooden houseboats, vibrant floating vegetable markets, and traditional shikara boat rides against the Pir Panjal mountains.",
        "short_description": "Scenic Himalayan lake famous for houseboats and shikara rides.",
        "latitude": 34.1089, "longitude": 74.8722, "address": "Boulevard Rd, Dal Lake, Srinagar, Jammu and Kashmir 190001",
        "heritage_status": "Living Cultural Wetland Heritage", "unesco_status": "Candidate", "historical_period": "Ancient",
        "best_time_to_visit": "April to October (Spring tulip bloom to autumn chinar leaves)",
        "opening_hours": {"monday": "06:00 - 20:00", "tuesday": "06:00 - 20:00", "wednesday": "06:00 - 20:00", "thursday": "06:00 - 20:00", "friday": "06:00 - 20:00", "saturday": "06:00 - 20:00", "sunday": "06:00 - 20:00"},
        "entry_fee_inr": {"indian": 0, "foreigner": 0, "child": 0}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-194-250-2279"}, "website": "https://jktourism.jk.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 4, "elevator_available": False, "notes": "Boulevard road has wide accessible pavement; ghat boarding requires manual aid."},
        "source": "Jammu & Kashmir Tourism", "source_url": "https://jktourism.jk.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "shalimar-bagh", "city_id": "srinagar", "state_id": "jammu-kashmir", "name": "Shalimar Bagh Mughal Garden", "slug": "shalimar-bagh",
        "category": "heritage", "sub_category": "garden",
        "description": "Renowned terraced Mughal garden laid out in 1619 by Emperor Jahangir for his wife Nur Jahan. Linked to Dal Lake via a canal, featuring cascading water fountains, chinar trees, and black marble pavilion pillars.",
        "short_description": "1619 imperial Mughal terraced garden with water cascades and ancient chinars.",
        "latitude": 34.1500, "longitude": 74.8722, "address": "Shalimar, Srinagar, Jammu and Kashmir 191121",
        "heritage_status": "UNESCO Tentative List (Mughal Gardens of Kashmir)", "unesco_status": "Tentative List", "historical_period": "1619 (Mughal Era)",
        "best_time_to_visit": "April to October",
        "opening_hours": {"monday": "09:00 - 19:00", "tuesday": "09:00 - 19:00", "wednesday": "09:00 - 19:00", "thursday": "09:00 - 19:00", "friday": "09:00 - 19:00", "saturday": "09:00 - 19:00", "sunday": "09:00 - 19:00"},
        "entry_fee_inr": {"indian": 24, "foreigner": 100, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-194-250-2279"}, "website": "https://jktourism.jk.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": True, "stairs_count": 8, "elevator_available": False, "notes": "Stone terraced pathways with ramp connections."},
        "source": "ASI / J&K Tourism", "source_url": "https://jktourism.jk.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },

    # --- GANGTOK (2) ---
    {
        "id": "rumtek-monastery", "city_id": "gangtok", "state_id": "sikkim", "name": "Rumtek Monastery (Dharma Chakra Centre)", "slug": "rumtek-monastery",
        "category": "spiritual", "sub_category": "monastery",
        "description": "Focal seat of the Karma Kagyu lineage of Tibetan Buddhism in exile, located 24 km from Gangtok. Features traditional Tibetan murals, golden stupas, precious silk thangkas, and monastic chanting halls.",
        "short_description": "Premier Kagyu Tibetan Buddhist monastery and golden stupa shrine.",
        "latitude": 27.3039, "longitude": 88.5492, "address": "Tsurphu Labrang Pal Karmae Sangha E-Wam Chokhorling, Rumtek, Sikkim 737135",
        "heritage_status": "State Heritage Buddhist Sanctum", "unesco_status": "None", "historical_period": "Rebuilt 1966 by 16th Karmapa",
        "best_time_to_visit": "March to May & October to December",
        "opening_hours": {"monday": "06:00 - 18:00", "tuesday": "06:00 - 18:00", "wednesday": "06:00 - 18:00", "thursday": "06:00 - 18:00", "friday": "06:00 - 18:00", "saturday": "06:00 - 18:00", "sunday": "06:00 - 18:00"},
        "entry_fee_inr": {"indian": 10, "foreigner": 50, "child": 0}, "estimated_visit_duration_min": 90,
        "contact_info": {"phone": "+91-3592-202-025"}, "website": "https://www.sikkimtourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1617854818583-09e7f077a156"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 35, "elevator_available": False, "notes": "Gentle uphill road leads to entrance gate; main prayer hall has steps."},
        "source": "Sikkim Tourism", "source_url": "https://www.sikkimtourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    },
    {
        "id": "tsomgo-lake", "city_id": "gangtok", "state_id": "sikkim", "name": "Tsomgo Lake (Changu Lake)", "slug": "tsomgo-lake",
        "category": "nature", "sub_category": "lake",
        "description": "Glacial high-altitude alpine lake located at an elevation of 3,753 meters (12,313 ft) on the Gangtok-Nathu La highway. Revered as sacred by indigenous Sikkimese people, reflecting snow-capped peaks in pristine turquoise waters.",
        "short_description": "Sacred turquoise glacial lake at 3,753m elevation in the East Himalayas.",
        "latitude": 27.3742, "longitude": 88.7619, "address": "Jawaharlal Nehru Rd, East Sikkim 737103",
        "heritage_status": "Protected High-Altitude Wetland", "unesco_status": "Buffer Zone of Kanchendzonga Biosphere", "historical_period": "Natural Glacial Formation",
        "best_time_to_visit": "October to December & April to May (Winter brings frozen snowscapes)",
        "opening_hours": {"monday": "08:00 - 15:00", "tuesday": "08:00 - 15:00", "wednesday": "08:00 - 15:00", "thursday": "08:00 - 15:00", "friday": "08:00 - 15:00", "saturday": "08:00 - 15:00", "sunday": "08:00 - 15:00"},
        "entry_fee_inr": {"indian": 200, "foreigner": 200, "child": 100}, "estimated_visit_duration_min": 120,
        "contact_info": {"phone": "+91-3592-202-025"}, "website": "https://www.sikkimtourism.gov.in",
        "image_urls": ["https://images.unsplash.com/photo-1617854818583-09e7f077a156"],
        "video_urls": [], "three_d_model_url": None,
        "accessibility_info": {"wheelchair_accessible": False, "stairs_count": 20, "elevator_available": False, "notes": "Ropeway cable car available; high altitude requires acclimatization."},
        "source": "Sikkim Tourism / Border Roads Organisation", "source_url": "https://www.sikkimtourism.gov.in", "verification_status": "Verified", "last_updated": "2026-08-30"
    }
]

transit_hubs = [
    # Mumbai
    {"id": "csmt", "city_id": "mumbai", "name": "Chhatrapati Shivaji Maharaj Terminus", "hub_type": "railway_station", "code": "CSMT", "latitude": 18.9400, "longitude": 72.8353, "line_info": {"lines": ["Central Railway", "Harbour Line", "Suburban Local", "Outstation Express"]}},
    {"id": "churchgate", "city_id": "mumbai", "name": "Churchgate Railway Station", "hub_type": "railway_station", "code": "CCG", "latitude": 18.9322, "longitude": 72.8264, "line_info": {"lines": ["Western Railway Suburban", "Local Fast/Slow"]}},
    {"id": "dadar", "city_id": "mumbai", "name": "Dadar Junction", "hub_type": "railway_station", "code": "DDR", "latitude": 19.0178, "longitude": 72.8478, "line_info": {"lines": ["Western Railway", "Central Railway Interchange"]}},
    {"id": "bandra-terminus", "city_id": "mumbai", "name": "Bandra Terminus", "hub_type": "railway_station", "code": "BDTS", "latitude": 19.0620, "longitude": 72.8410, "line_info": {"lines": ["Western Railway", "North/West India Express Trains"]}},
    {"id": "bom-airport", "city_id": "mumbai", "name": "Chhatrapati Shivaji Maharaj International Airport", "hub_type": "airport", "code": "BOM", "latitude": 19.0896, "longitude": 72.8656, "line_info": {"terminals": ["T1 Domestic", "T2 International"]}},
    
    # Delhi
    {"id": "ndls", "city_id": "delhi", "name": "New Delhi Railway Station", "hub_type": "railway_station", "code": "NDLS", "latitude": 28.6427, "longitude": 77.2198, "line_info": {"lines": ["Northern Railway", "Delhi Metro Yellow/Airport Express"]}},
    {"id": "delhi-junction", "city_id": "delhi", "name": "Old Delhi Railway Station", "hub_type": "railway_station", "code": "DLI", "latitude": 28.6606, "longitude": 77.2301, "line_info": {"lines": ["Northern Railway", "Delhi Metro Yellow Line"]}},
    {"id": "nizamuddin", "city_id": "delhi", "name": "Hazrat Nizamuddin Railway Station", "hub_type": "railway_station", "code": "NZM", "latitude": 28.5888, "longitude": 77.2533, "line_info": {"lines": ["Northern Railway", "Delhi Metro Pink Line"]}},
    {"id": "del-airport", "city_id": "delhi", "name": "Indira Gandhi International Airport", "hub_type": "airport", "code": "DEL", "latitude": 28.5562, "longitude": 77.1000, "line_info": {"lines": ["Airport Express Metro"]}},

    # Jaipur
    {"id": "jaipur-junction", "city_id": "jaipur", "name": "Jaipur Junction Railway Station", "hub_type": "railway_station", "code": "JP", "latitude": 26.9200, "longitude": 75.7878, "line_info": {"lines": ["North Western Railway", "Jaipur Metro Pink Line"]}},
    {"id": "gandhinagar-jaipur", "city_id": "jaipur", "name": "Gandhinagar Jaipur Station", "hub_type": "railway_station", "code": "GADJ", "latitude": 26.8833, "longitude": 75.8000, "line_info": {"lines": ["North Western Railway"]}},

    # Agra
    {"id": "agra-cantt", "city_id": "agra", "name": "Agra Cantt Railway Station", "hub_type": "railway_station", "code": "AGC", "latitude": 27.1580, "longitude": 77.9900, "line_info": {"lines": ["North Central Railway", "Gatimaan / Vande Bharat Express"]}},

    # Varanasi
    {"id": "varanasi-junction", "city_id": "varanasi", "name": "Varanasi Junction (Cantt)", "hub_type": "railway_station", "code": "BSB", "latitude": 25.3280, "longitude": 82.9860, "line_info": {"lines": ["Northern Railway", "North Eastern Railway"]}},

    # Kochi
    {"id": "ernakulam-junction", "city_id": "kochi", "name": "Ernakulam Junction (South)", "hub_type": "railway_station", "code": "ERS", "latitude": 9.9678, "longitude": 76.2892, "line_info": {"lines": ["Southern Railway", "Kochi Metro Connection"]}},
    {"id": "ernakulam-town", "city_id": "kochi", "name": "Ernakulam Town (North)", "hub_type": "railway_station", "code": "ERN", "latitude": 9.9920, "longitude": 76.2880, "line_info": {"lines": ["Southern Railway"]}},

    # Goa
    {"id": "madgaon-junction", "city_id": "goa", "name": "Madgaon Junction Railway Station", "hub_type": "railway_station", "code": "MAO", "latitude": 15.2740, "longitude": 73.9780, "line_info": {"lines": ["Konkan Railway", "South Western Railway"]}},
    {"id": "thivim", "city_id": "goa", "name": "Thivim Railway Station", "hub_type": "railway_station", "code": "THVM", "latitude": 15.6030, "longitude": 73.8490, "line_info": {"lines": ["Konkan Railway"]}},

    # Bengaluru
    {"id": "kr-city-bengaluru", "city_id": "bengaluru", "name": "KSR Bengaluru City Railway Station", "hub_type": "railway_station", "code": "SBC", "latitude": 12.9781, "longitude": 77.5696, "line_info": {"lines": ["South Western Railway", "Namma Metro Purple Line"]}},

    # Hyderabad
    {"id": "secunderabad", "city_id": "hyderabad", "name": "Secunderabad Junction", "hub_type": "railway_station", "code": "SC", "latitude": 17.4344, "longitude": 78.5011, "line_info": {"lines": ["South Central Railway", "Hyderabad Metro Blue/Green Lines"]}},

    # Kolkata
    {"id": "howrah-station", "city_id": "kolkata", "name": "Howrah Railway Station", "hub_type": "railway_station", "code": "HWH", "latitude": 22.5839, "longitude": 88.3426, "line_info": {"lines": ["Eastern Railway", "South Eastern Railway", "Kolkata Metro Green Line (Underwater)"]}},

    # Amritsar
    {"id": "amritsar-junction", "city_id": "amritsar", "name": "Amritsar Junction Railway Station", "hub_type": "railway_station", "code": "ASR", "latitude": 31.6330, "longitude": 74.8655, "line_info": {"lines": ["Northern Railway"]}}
]

fare_rules = [
    {"transport_mode": "WALK", "base_fare": 0.0, "per_km_rate": 0.0, "min_distance_km": 0.0, "max_surge_multiplier": 1.0, "tariff_source": "Free Active Mobility"},
    {"transport_mode": "BICYCLE", "base_fare": 15.0, "per_km_rate": 2.0, "min_distance_km": 0.5, "max_surge_multiplier": 1.0, "tariff_source": "Public Bike Share (Smart Cities Mission)"},
    {"transport_mode": "SUBURBAN_RAIL", "base_fare": 5.0, "per_km_rate": 0.5, "min_distance_km": 1.0, "max_surge_multiplier": 1.0, "tariff_source": "Indian Railways Suburban Fare Table (Second Class)"},
    {"transport_mode": "METRO", "base_fare": 10.0, "per_km_rate": 2.5, "min_distance_km": 1.0, "max_surge_multiplier": 1.0, "tariff_source": "City Metro Rail Fare Matrix"},
    {"transport_mode": "BUS", "base_fare": 6.0, "per_km_rate": 1.8, "min_distance_km": 1.0, "max_surge_multiplier": 1.0, "tariff_source": "State Road Transport Undertaking (SRTU)"},
    {"transport_mode": "AUTO_RICKSHAW", "base_fare": 23.0, "per_km_rate": 15.33, "min_distance_km": 1.5, "max_surge_multiplier": 1.25, "tariff_source": "Regional Transport Authority (RTO Meter Rates)"},
    {"transport_mode": "TAXI_CAB", "base_fare": 32.0, "per_km_rate": 18.5, "min_distance_km": 1.5, "max_surge_multiplier": 1.5, "tariff_source": "RTO Black-and-Yellow / App-Based Aggregator Tariff"}
]

data = {
    "states": states,
    "cities": cities,
    "places": places,
    "transit_hubs": transit_hubs,
    "fare_rules": fare_rules
}

out_path = os.path.join("backend", "app", "data", "india_tourism.json")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Generated {len(places)} places across {len(states)} states and {len(cities)} cities into {out_path}.")

