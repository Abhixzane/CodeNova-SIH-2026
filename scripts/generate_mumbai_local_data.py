import json

# Comprehensive Mumbai Suburban Railway Network Dataset
# Western, Central, and Harbour lines with accurate distances, coordinates, and interchanges

mumbai_local_network = {
  "meta": {
    "system": "Mumbai Suburban Railway (Lifeline of Mumbai)",
    "operator": "Western Railway (WR) & Central Railway (CR)",
    "track_gauge": "1,676 mm (5 ft 6 in) Broad Gauge",
    "electrification": "25 kV AC overhead catenary",
    "daily_ridership": "Approx. 7.5 Million passengers",
    "data_source": "Official Western & Central Suburban Railway Network Maps & Fare Slabs",
    "fare_label": "Official / Dataset Standard Suburban Fare"
  },
  "fare_slabs": [
    {"max_km": 10, "second_class": 5, "first_class": 50, "ac_local": 35},
    {"max_km": 20, "second_class": 10, "first_class": 70, "ac_local": 60},
    {"max_km": 30, "second_class": 10, "first_class": 105, "ac_local": 85},
    {"max_km": 40, "second_class": 15, "first_class": 140, "ac_local": 105},
    {"max_km": 50, "second_class": 15, "first_class": 140, "ac_local": 115},
    {"max_km": 60, "second_class": 20, "first_class": 175, "ac_local": 135},
    {"max_km": 70, "second_class": 20, "first_class": 175, "ac_local": 155}
  ],
  "lines": {
    "western": {
      "name": "Western Line",
      "color": "#e11d48", # Red
      "terminus_south": "Churchgate (CCG)",
      "terminus_north": "Virar / Dahanu Road",
      "stations": [
        {"order": 1, "code": "CCG", "name": "Churchgate", "km_from_start": 0, "lat": 18.9322, "lng": 72.8264, "is_interchange": False, "interchanges": []},
        {"order": 2, "code": "MEL", "name": "Marine Lines", "km_from_start": 1.4, "lat": 18.9438, "lng": 72.8242, "is_interchange": False, "interchanges": []},
        {"order": 3, "code": "CYR", "name": "Charni Road", "km_from_start": 2.5, "lat": 18.9517, "lng": 72.8188, "is_interchange": False, "interchanges": ["Girgaon Chowpatty Access"]},
        {"order": 4, "code": "GTR", "name": "Grant Road", "km_from_start": 3.8, "lat": 18.9625, "lng": 72.8160, "is_interchange": False, "interchanges": []},
        {"order": 5, "code": "MMCT", "name": "Mumbai Central", "km_from_start": 4.6, "lat": 18.9696, "lng": 72.8193, "is_interchange": True, "interchanges": ["National Express Hub", "Metro Line 3"]},
        {"order": 6, "code": "MX", "name": "Mahalaxmi", "km_from_start": 6.2, "lat": 18.9827, "lng": 72.8239, "is_interchange": False, "interchanges": ["Dhobi Ghat", "Race Course"]},
        {"order": 7, "code": "PL", "name": "Lower Parel", "km_from_start": 7.8, "lat": 18.9950, "lng": 72.8290, "is_interchange": True, "interchanges": ["Mumbai Monorail (Currey Road connection)"]},
        {"order": 8, "code": "PBHD", "name": "Prabhadevi", "km_from_start": 9.2, "lat": 19.0110, "lng": 72.8360, "is_interchange": True, "interchanges": ["Parel (Central Line Foot Overbridge)"]},
        {"order": 9, "code": "DDR", "name": "Dadar (Western)", "km_from_start": 10.3, "lat": 19.0183, "lng": 72.8428, "is_interchange": True, "interchanges": ["Central Line Major Interchange", "National Express Trains"]},
        {"order": 10, "code": "MRU", "name": "Matunga Road", "km_from_start": 11.6, "lat": 19.0280, "lng": 72.8430, "is_interchange": False, "interchanges": []},
        {"order": 11, "code": "MM", "name": "Mahim Junction", "km_from_start": 13.0, "lat": 19.0400, "lng": 72.8440, "is_interchange": True, "interchanges": ["Harbour Line Link to CSMT/Panvel"]},
        {"order": 12, "code": "BA", "name": "Bandra", "km_from_start": 14.8, "lat": 19.0544, "lng": 72.8402, "is_interchange": True, "interchanges": ["Harbour Line", "Bandra Terminus Express"]},
        {"order": 13, "code": "KHAR", "name": "Khar Road", "km_from_start": 16.5, "lat": 19.0690, "lng": 72.8380, "is_interchange": False, "interchanges": []},
        {"order": 14, "code": "STC", "name": "Santacruz", "km_from_start": 18.0, "lat": 19.0820, "lng": 72.8410, "is_interchange": False, "interchanges": ["Domestic Airport Terminal connection"]},
        {"order": 15, "code": "VLP", "name": "Vile Parle", "km_from_start": 19.8, "lat": 19.0990, "lng": 72.8440, "is_interchange": False, "interchanges": []},
        {"order": 16, "code": "ADH", "name": "Andheri", "km_from_start": 21.8, "lat": 19.1197, "lng": 72.8464, "is_interchange": True, "interchanges": ["Metro Line 1 (Versova-Ghatkopar)", "Harbour Line", "Fast Local Hub"]},
        {"order": 17, "code": "JOS", "name": "Jogeshwari", "km_from_start": 23.8, "lat": 19.1350, "lng": 72.8490, "is_interchange": False, "interchanges": []},
        {"order": 18, "code": "RMAR", "name": "Ram Mandir", "km_from_start": 25.1, "lat": 19.1480, "lng": 72.8480, "is_interchange": False, "interchanges": []},
        {"order": 19, "code": "GMN", "name": "Goregaon", "km_from_start": 26.6, "lat": 19.1640, "lng": 72.8490, "is_interchange": True, "interchanges": ["Harbour Line Extension", "Metro Line 2A"]},
        {"order": 20, "code": "MDD", "name": "Malad", "km_from_start": 29.5, "lat": 19.1860, "lng": 72.8480, "is_interchange": False, "interchanges": []},
        {"order": 21, "code": "KND", "name": "Kandivali", "km_from_start": 31.7, "lat": 19.2040, "lng": 72.8520, "is_interchange": False, "interchanges": []},
        {"order": 22, "code": "BVI", "name": "Borivali", "km_from_start": 34.0, "lat": 19.2294, "lng": 72.8574, "is_interchange": True, "interchanges": ["National Express Trains", "Sanjay Gandhi National Park Gateway", "Fast Corridor Terminal"]},
        {"order": 23, "code": "BYR", "name": "Bhayandar", "km_from_start": 43.2, "lat": 19.3010, "lng": 72.8530, "is_interchange": False, "interchanges": []},
        {"order": 24, "code": "BSR", "name": "Vasai Road", "km_from_start": 51.5, "lat": 19.3800, "lng": 72.8310, "is_interchange": True, "interchanges": ["Panvel-Diva-Vasai Chord Line", "Express Trains"]},
        {"order": 25, "code": "VR", "name": "Virar", "km_from_start": 59.9, "lat": 19.4550, "lng": 72.8110, "is_interchange": True, "interchanges": ["Western Suburban Electrified Terminal", "Shuttle to Dahanu Road"]}
      ]
    },
    "central": {
      "name": "Central Line (Main Line)",
      "color": "#0284c7", # Sky Blue
      "terminus_south": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
      "terminus_north": "Kalyan / Kasara / Karjat",
      "stations": [
        {"order": 1, "code": "CSMT", "name": "Chhatrapati Shivaji Maharaj Terminus", "km_from_start": 0, "lat": 18.9400, "lng": 72.8353, "is_interchange": True, "interchanges": ["Harbour Line", "National Express Rail", "Heritage Monument"]},
        {"order": 2, "code": "MSD", "name": "Masjid", "km_from_start": 1.4, "lat": 18.9510, "lng": 72.8400, "is_interchange": True, "interchanges": ["Harbour Line"]},
        {"order": 3, "code": "SNRD", "name": "Sandhurst Road", "km_from_start": 2.5, "lat": 18.9610, "lng": 72.8420, "is_interchange": True, "interchanges": ["Harbour Line Upper Level"]},
        {"order": 4, "code": "BY", "name": "Byculla", "km_from_start": 4.1, "lat": 18.9770, "lng": 72.8330, "is_interchange": False, "interchanges": ["Jijamata Udyan (Rani Baug Zoo)"]},
        {"order": 5, "code": "CHG", "name": "Chinchpokli", "km_from_start": 5.2, "lat": 18.9890, "lng": 72.8320, "is_interchange": False, "interchanges": []},
        {"order": 6, "code": "CRD", "name": "Currey Road", "km_from_start": 6.1, "lat": 18.9970, "lng": 72.8330, "is_interchange": True, "interchanges": ["Mumbai Monorail connection"]},
        {"order": 7, "code": "PR", "name": "Parel", "km_from_start": 7.4, "lat": 19.0090, "lng": 72.8370, "is_interchange": True, "interchanges": ["Prabhadevi (Western Line Foot Overbridge)"]},
        {"order": 8, "code": "DR", "name": "Dadar (Central)", "km_from_start": 8.9, "lat": 19.0183, "lng": 72.8428, "is_interchange": True, "interchanges": ["Western Line Major Interchange", "Fast Local Hub"]},
        {"order": 9, "code": "MTN", "name": "Matunga", "km_from_start": 10.2, "lat": 19.0270, "lng": 72.8550, "is_interchange": False, "interchanges": []},
        {"order": 10, "code": "SIN", "name": "Sion", "km_from_start": 12.3, "lat": 19.0410, "lng": 72.8620, "is_interchange": False, "interchanges": []},
        {"order": 11, "code": "CLA", "name": "Kurla", "km_from_start": 15.1, "lat": 19.0660, "lng": 72.8790, "is_interchange": True, "interchanges": ["Harbour Line Interchange", "Lokmanya Tilak Terminus (LTT) Link"]},
        {"order": 12, "code": "VVH", "name": "Vidyavihar", "km_from_start": 17.0, "lat": 19.0800, "lng": 72.8960, "is_interchange": False, "interchanges": []},
        {"order": 13, "code": "GC", "name": "Ghatkopar", "km_from_start": 19.3, "lat": 19.0860, "lng": 72.9080, "is_interchange": True, "interchanges": ["Metro Line 1 (Ghatkopar-Andheri-Versova)", "Fast Corridor Hub"]},
        {"order": 14, "code": "VK", "name": "Vikhroli", "km_from_start": 22.8, "lat": 19.1110, "lng": 72.9280, "is_interchange": False, "interchanges": []},
        {"order": 15, "code": "KJRD", "name": "Kanjurmarg", "km_from_start": 24.7, "lat": 19.1270, "lng": 72.9360, "is_interchange": False, "interchanges": []},
        {"order": 16, "code": "BND", "name": "Bhandup", "km_from_start": 26.6, "lat": 19.1430, "lng": 72.9420, "is_interchange": False, "interchanges": []},
        {"order": 17, "code": "NHU", "name": "Nahur", "km_from_start": 28.1, "lat": 19.1570, "lng": 72.9460, "is_interchange": False, "interchanges": []},
        {"order": 18, "code": "MLND", "name": "Mulund", "km_from_start": 30.6, "lat": 19.1730, "lng": 72.9560, "is_interchange": False, "interchanges": []},
        {"order": 19, "code": "TNA", "name": "Thane Junction", "km_from_start": 33.7, "lat": 19.1860, "lng": 72.9754, "is_interchange": True, "interchanges": ["Trans-Harbour Line to Navi Mumbai / Vashi / Panvel", "National Express Hub"]},
        {"order": 20, "code": "DI", "name": "Dombivli", "km_from_start": 48.0, "lat": 19.2180, "lng": 73.0860, "is_interchange": False, "interchanges": ["Fast Corridor Terminal"]},
        {"order": 21, "code": "KYN", "name": "Kalyan Junction", "km_from_start": 53.2, "lat": 19.2437, "lng": 73.1355, "is_interchange": True, "interchanges": ["Bifurcation to Kasara / Nashik and Karjat / Pune", "Major National Rail Hub"]}
      ]
    },
    "harbour": {
      "name": "Harbour Line",
      "color": "#16a34a", # Green
      "terminus_south": "CSMT",
      "terminus_east": "Panvel / Goregaon",
      "stations": [
        {"order": 1, "code": "CSMT", "name": "CSMT (Harbour)", "km_from_start": 0, "lat": 18.9400, "lng": 72.8353, "is_interchange": True, "interchanges": ["Central Main Line", "National Express"]},
        {"order": 2, "code": "MSD", "name": "Masjid", "km_from_start": 1.4, "lat": 18.9510, "lng": 72.8400, "is_interchange": True, "interchanges": ["Central Line"]},
        {"order": 3, "code": "SNRD", "name": "Sandhurst Road", "km_from_start": 2.5, "lat": 18.9610, "lng": 72.8420, "is_interchange": True, "interchanges": ["Central Line"]},
        {"order": 4, "code": "DKRD", "name": "Dockyard Road", "km_from_start": 3.7, "lat": 18.9680, "lng": 72.8470, "is_interchange": False, "interchanges": []},
        {"order": 5, "code": "RRD", "name": "Reay Road", "km_from_start": 4.9, "lat": 18.9770, "lng": 72.8470, "is_interchange": False, "interchanges": []},
        {"order": 6, "code": "CTGN", "name": "Cotton Green", "km_from_start": 5.9, "lat": 18.9860, "lng": 72.8480, "is_interchange": False, "interchanges": []},
        {"order": 7, "code": "SVE", "name": "Sewri", "km_from_start": 7.4, "lat": 18.9980, "lng": 72.8520, "is_interchange": False, "interchanges": ["Sewri Flamingo Mudflats & MTHL Atal Setu Link"]},
        {"order": 8, "code": "VDLR", "name": "Vadala Road", "km_from_start": 9.2, "lat": 19.0170, "lng": 72.8580, "is_interchange": True, "interchanges": ["Bifurcation: to Bandra/Andheri and to Kurla/Panvel", "Monorail Interchange"]},
        {"order": 9, "code": "GTBN", "name": "Guru Tegh Bahadur Nagar", "km_from_start": 11.3, "lat": 19.0370, "lng": 72.8670, "is_interchange": False, "interchanges": []},
        {"order": 10, "code": "CHF", "name": "Chunabhatti", "km_from_start": 13.0, "lat": 19.0520, "lng": 72.8730, "is_interchange": False, "interchanges": []},
        {"order": 11, "code": "CLA", "name": "Kurla (Harbour)", "km_from_start": 15.3, "lat": 19.0660, "lng": 72.8790, "is_interchange": True, "interchanges": ["Central Main Line Interchange"]},
        {"order": 12, "code": "TKNG", "name": "Tilak Nagar", "km_from_start": 17.1, "lat": 19.0710, "lng": 72.8940, "is_interchange": True, "interchanges": ["LTT Terminus Foot Connection"]},
        {"order": 13, "code": "CMBR", "name": "Chembur", "km_from_start": 18.3, "lat": 19.0620, "lng": 72.8990, "is_interchange": True, "interchanges": ["Monorail Chembur Hub"]},
        {"order": 14, "code": "GV", "name": "Govandi", "km_from_start": 20.0, "lat": 19.0550, "lng": 72.9150, "is_interchange": False, "interchanges": []},
        {"order": 15, "code": "MNKD", "name": "Mankhurd", "km_from_start": 22.0, "lat": 19.0500, "lng": 72.9320, "is_interchange": False, "interchanges": ["Last station in Mumbai city before Thane Creek Railway Bridge"]},
        {"order": 16, "code": "VSH", "name": "Vashi", "km_from_start": 29.8, "lat": 19.0770, "lng": 72.9980, "is_interchange": True, "interchanges": ["Trans-Harbour Line to Thane", "Navi Mumbai Commercial Hub"]},
        {"order": 17, "code": "NEU", "name": "Nerul", "km_from_start": 38.6, "lat": 19.0330, "lng": 73.0180, "is_interchange": True, "interchanges": ["Uran Line Interchange"]},
        {"order": 18, "code": "BEPR", "name": "Belapur CBD", "km_from_start": 43.6, "lat": 19.0190, "lng": 73.0390, "is_interchange": True, "interchanges": ["Navi Mumbai Metro Line 1"]},
        {"order": 19, "code": "PNVL", "name": "Panvel", "km_from_start": 48.9, "lat": 18.9890, "lng": 73.1180, "is_interchange": True, "interchanges": ["Harbour Terminal", "Konkan Railway Gateway", "Navi Mumbai International Airport (NMIA) connection"]}
      ]
    }
  }
}

with open('data/mumbai_local_network.json', 'w', encoding='utf-8') as f:
    json.dump(mumbai_local_network, f, indent=2, ensure_ascii=False)

print("Generated data/mumbai_local_network.json with Western, Central, and Harbour lines!")
