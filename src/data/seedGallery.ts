import { MediaItem, MemoryEvent, LifeRecap, KnowledgeNode, KnowledgeEdge } from '../types';

export const SEED_GALLERY: MediaItem[] = [
  {
    id: 'luma-001',
    title: 'Honda Hness CB350 by Red Brick Wall',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-10T16:45:00Z',
    location: {
      name: 'Jubilee Hills Art District',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4319,
      longitude: 78.4073
    },
    camera: {
      make: 'Sony',
      model: 'Alpha 7 IV',
      iso: 100,
      aperture: 'f/1.8',
      focalLength: '50mm'
    },
    ocrText: 'HONDA CB350 Hness ABS DUAL CHANNEL',
    detectedObjects: ['motorcycle', 'Honda bike', 'red brick building', 'helmet', 'vehicle', 'two-wheeler'],
    semanticTags: ['automotive', 'urban', 'commute', 'red motorcycle', 'parking', 'street photography'],
    boundingBoxes: [
      { label: 'Honda Motorcycle', confidence: 0.98, box: [20, 15, 88, 85], category: 'vehicle' },
      { label: 'Red Brick Wall', confidence: 0.94, box: [5, 5, 45, 95], category: 'nature' }
    ],
    qualityScore: 96,
    isFavorite: true,
    fileSize: '4.2 MB',
    dimensions: { width: 4000, height: 2667 },
    aiDescription: 'Red & black Honda CB350 motorcycle parked gracefully in front of a weathered red brick building facade.',
    album: 'Motorcycle Adventures'
  },
  {
    id: 'luma-002',
    title: 'Honda Motorcycle Battery Invoice',
    type: 'receipt',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-12T11:20:00Z',
    location: {
      name: 'ABC Motors Workshop & Spares',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4421,
      longitude: 78.3842
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 40,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: 'ABC MOTORS HONDA AUTHORIZED SERVICE\nTAX INVOICE / CASH RECEIPT #AB-8821\nDATE: 12-AUG-2026 11:20 AM\nCUSTOMER: SYED ABDUL\nVEHICLE: HONDA CB350 (TS09FA4021)\nITEM: EXIDE XLTZ9 HONDA MOTORCYCLE BATTERY 12V 9AH\nWARRANTY: 48 MONTHS REPLACEMENT\nBATTERY SERIAL: EX-9948201\nUNIT PRICE: ₹4,500.00\nLABOR CHARGES: ₹200.00\nDISCOUNT: ₹200.00\nTOTAL AMOUNT PAID: ₹4,500.00 (PAID VIA UPI)\nTHANK YOU FOR VISITING ABC MOTORS',
    detectedObjects: ['receipt', 'invoice', 'paper document', 'Honda battery receipt', 'bill'],
    semanticTags: ['financial', 'receipt', 'expense', 'maintenance', 'Honda', 'motorcycle battery', 'vehicle service', 'August 2026'],
    boundingBoxes: [
      { label: 'Receipt Document', confidence: 0.99, box: [10, 10, 90, 90], category: 'document' },
      { label: 'Header & Amount', confidence: 0.97, box: [15, 15, 40, 85], category: 'text' }
    ],
    documentMetadata: {
      documentType: 'receipt',
      title: 'Honda Motorcycle Battery Purchase Receipt',
      vendor: 'ABC Motors',
      amount: '₹4,500',
      currency: 'INR',
      date: 'August 12, 2026',
      invoiceNumber: 'AB-8821',
      productName: 'Exide XLTZ9 Honda Motorcycle Battery 12V 9Ah',
      importantEntities: {
        'Vehicle Model': 'Honda CB350',
        'Warranty': '48 Months',
        'Battery Serial': 'EX-9948201',
        'Payment Mode': 'UPI'
      }
    },
    qualityScore: 92,
    fileSize: '1.8 MB',
    dimensions: { width: 3024, height: 4032 },
    aiDescription: 'Official tax invoice from ABC Motors for purchasing a Honda motorcycle battery totaling ₹4,500.',
    album: 'Receipts & Invoices'
  },
  {
    id: 'luma-003',
    title: 'New Exide Battery Installation in Bike',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-12T11:45:00Z',
    location: {
      name: 'ABC Motors Service Bay 3',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4421,
      longitude: 78.3842
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 80,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: 'EXIDE 12V 9AH XLTZ9 SEALED MAINTENANCE FREE LEAD ACID BATTERY FOR HONDA',
    detectedObjects: ['motorcycle battery', 'tools', 'mechanic', 'wires', 'engine bay', 'Honda motorcycle'],
    semanticTags: ['maintenance', 'battery replacement', 'workshop', 'Honda repair', 'mechanic', 'August 2026'],
    boundingBoxes: [
      { label: 'Exide Battery', confidence: 0.96, box: [35, 30, 75, 70], category: 'object' },
      { label: 'Wiring & Terminals', confidence: 0.91, box: [25, 20, 50, 60], category: 'object' }
    ],
    qualityScore: 89,
    fileSize: '3.1 MB',
    dimensions: { width: 4032, height: 3024 },
    aiDescription: 'Close-up of new Exide 12V motorcycle battery being wired into the battery tray of a Honda motorcycle.',
    album: 'Motorcycle Adventures'
  },
  {
    id: 'luma-004',
    title: 'Screenshot — Fiber WiFi Router Password',
    type: 'screenshot',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-07-28T20:14:00Z',
    location: {
      name: 'Home Apartment',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'System Screenshot',
      model: 'Display Capture',
    },
    ocrText: 'NETWORK SETTINGS - HOME FIBER\nSSID (2.4GHz): Orion_Home_2.4G\nSSID (5GHz High Speed): Orion_Nebula_5G\nWiFi Password: Quantum#Secret$9942\nRouter IP: 192.168.1.1\nAdmin Login: admin / SuperKey2026\nGuest WiFi: Orion_Guest (Pass: Welcome2026)',
    detectedObjects: ['screenshot', 'network settings', 'wifi credentials', 'password text', 'QR code'],
    semanticTags: ['wifi password', 'credentials', 'screenshot', 'home network', 'internet', 'passwords', 'sensitive'],
    boundingBoxes: [
      { label: 'WiFi Password Field', confidence: 0.99, box: [40, 15, 65, 85], category: 'text' }
    ],
    documentMetadata: {
      documentType: 'wifi_credential',
      title: 'Home WiFi Password Credentials',
      importantEntities: {
        '5G Network Name': 'Orion_Nebula_5G',
        'WiFi Password': 'Quantum#Secret$9942',
        'Router IP': '192.168.1.1',
        'Guest WiFi': 'Orion_Guest (Welcome2026)'
      }
    },
    qualityScore: 90,
    fileSize: '840 KB',
    dimensions: { width: 1179, height: 2556 },
    aiDescription: 'Mobile screenshot containing home optical fiber network SSID and WiFi password Quantum#Secret$9942.',
    album: 'Passwords & Keys'
  },
  {
    id: 'luma-005',
    title: 'White Golden Retriever on Anjuna Beach',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=500&q=80',
    timestamp: '2025-12-19T17:30:00Z',
    location: {
      name: 'Anjuna Beach',
      city: 'Goa',
      country: 'India',
      latitude: 15.5733,
      longitude: 73.7410
    },
    camera: {
      make: 'Sony',
      model: 'Alpha 7 IV',
      iso: 200,
      aperture: 'f/2.8',
      focalLength: '85mm'
    },
    ocrText: '',
    detectedObjects: ['dog', 'white dog', 'golden retriever', 'beach', 'ocean waves', 'sand', 'sunset'],
    semanticTags: ['pets', 'beach vacation', 'Goa trip', 'golden hour', 'ocean', 'playful dog', 'December 2025'],
    boundingBoxes: [
      { label: 'White Dog Running', confidence: 0.99, box: [25, 20, 80, 80], category: 'animal' },
      { label: 'Sunset Ocean Waves', confidence: 0.95, box: [5, 5, 50, 95], category: 'nature' }
    ],
    qualityScore: 98,
    isFavorite: true,
    fileSize: '5.6 MB',
    dimensions: { width: 4200, height: 2800 },
    aiDescription: 'A happy white golden retriever dog running joyfully on the golden sands of Anjuna Beach at sunset.',
    album: 'Goa Holiday'
  },
  {
    id: 'luma-006',
    title: 'Special Mutton Biryani at Paradise Hyderabad',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-06-14T20:30:00Z',
    location: {
      name: 'Paradise Food Court, Secunderabad',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4411,
      longitude: 78.4983
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 160,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: 'PARADISE WORLD FAMOUS BIRYANI ESTD 1953\nTABLE 14 - SPECIAL HYDERABADI MUTTON BIRYANI',
    detectedObjects: ['biryani', 'rice dish', 'spices', 'restaurant food', 'dining table', 'mirchi ka salan'],
    semanticTags: ['food', 'dining', 'Hyderabadi biryani', 'restaurant', 'Paradise food court', 'mutton', 'June 2026'],
    boundingBoxes: [
      { label: 'Pot of Biryani', confidence: 0.98, box: [15, 10, 85, 90], category: 'food' }
    ],
    qualityScore: 94,
    fileSize: '3.8 MB',
    dimensions: { width: 3840, height: 2880 },
    aiDescription: 'Authentic aromatic Hyderabadi mutton biryani served in traditional copper dish with saffron rice garnish.',
    album: 'Culinary Memories'
  },
  {
    id: 'luma-007',
    title: 'Misty Coffee Plantations in Araku Valley',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-02-14T07:15:00Z',
    location: {
      name: 'Araku Valley Hill Resort Viewpoint',
      city: 'Araku Valley',
      country: 'India',
      latitude: 18.3273,
      longitude: 82.8775
    },
    camera: {
      make: 'Fujifilm',
      model: 'X-T5',
      iso: 125,
      aperture: 'f/4.0',
      focalLength: '23mm'
    },
    ocrText: 'WELCOME TO ARAKU VALLEY ORGANIC COFFEE ESTATE - ELEVATION 910M',
    detectedObjects: ['mountains', 'morning fog', 'coffee trees', 'valley', 'landscape', 'clouds'],
    semanticTags: ['travel', 'nature', 'Araku Valley', 'road trip', 'mountains', 'Valentine weekend', 'Feb 2026'],
    boundingBoxes: [
      { label: 'Mountain Range', confidence: 0.97, box: [5, 5, 60, 95], category: 'nature' }
    ],
    qualityScore: 99,
    isFavorite: true,
    fileSize: '6.1 MB',
    dimensions: { width: 6240, height: 4160 },
    aiDescription: 'Breathtaking sunrise mist enveloping lush rolling hills of Araku Valley coffee plantations.',
    album: 'Araku Valley Road Trip'
  },
  {
    id: 'luma-008',
    title: 'Two-Wheeler Comprehensive Insurance Policy',
    type: 'document',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-01-05T14:10:00Z',
    location: {
      name: 'Digital Document Archive',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'Document Scanner',
      model: 'Flatbed CamScan',
    },
    ocrText: 'ICICI LOMBARD GENERAL INSURANCE COMPANY LTD\nTWO-WHEELER PACKAGE POLICY CERTIFICATE\nPOLICY NO: 3005/2026/8849102\nINSURED NAME: SYED ABDUL\nVEHICLE: HONDA CB350 HNESS DLX PRO\nENGINE NO: NC59E1029482\nCHASSIS NO: ME4NC592L0019284\nREGISTRATION NO: TS 09 FA 4021\nIDV (INSURED DECLARED VALUE): ₹1,95,000\nPOLICY VALIDITY: 05-JAN-2026 TO 04-JAN-2027\nPREMIUM PAID: ₹3,840.00\nZERO DEPRECIATION COVER INCLUDED',
    detectedObjects: ['document', 'insurance certificate', 'policy paper', 'stamp and signature', 'Honda document'],
    semanticTags: ['insurance', 'Honda motorcycle', 'legal document', 'two-wheeler policy', 'vehicle insurance', 'financial'],
    boundingBoxes: [
      { label: 'Insurance Certificate', confidence: 0.99, box: [10, 10, 90, 90], category: 'document' }
    ],
    documentMetadata: {
      documentType: 'insurance',
      title: 'Honda CB350 Two-Wheeler Insurance Policy',
      vendor: 'ICICI Lombard',
      amount: '₹3,840',
      currency: 'INR',
      date: 'January 5, 2026',
      invoiceNumber: '3005/2026/8849102',
      productName: 'Honda CB350 DLX Pro Insurance Cover',
      importantEntities: {
        'Vehicle Reg': 'TS 09 FA 4021',
        'Insured Value': '₹1,95,000',
        'Valid Until': '04-JAN-2027',
        'Coverage': 'Zero Depreciation'
      }
    },
    qualityScore: 91,
    fileSize: '2.4 MB',
    dimensions: { width: 2480, height: 3508 },
    aiDescription: 'Official two-wheeler vehicle insurance policy document for Honda CB350 with IDV ₹1,95,000.',
    album: 'Official Documents'
  },
  {
    id: 'luma-009',
    title: 'IndiGo Boarding Pass Hyderabad to Goa',
    type: 'document',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80',
    timestamp: '2025-12-18T05:30:00Z',
    location: {
      name: 'Rajiv Gandhi International Airport (HYD)',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.2403,
      longitude: 78.4294
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 100,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: 'INDIGO AIRLINES - BOARDING PASS\nPASSENGER: ABDUL / S MR\nFLIGHT: 6E 428 | DATE: 18-DEC-2025\nFROM: HYDERABAD (HYD) - TERMINAL 1\nTO: GOA MOPA (GOX)\nBOARDING TIME: 06:10 AM | DEPARTURE: 06:50 AM\nSEAT: 12F (WINDOW) | ZONE: 2 | GATE: 24B\nSEQ NO: 042 | PNR: X89QW2',
    detectedObjects: ['boarding pass', 'flight ticket', 'barcode', 'airport document', 'travel pass'],
    semanticTags: ['travel', 'flight', 'boarding pass', 'Goa trip', 'IndiGo airlines', 'December 2025', 'airport'],
    boundingBoxes: [
      { label: 'Boarding Pass Ticket', confidence: 0.99, box: [15, 10, 85, 90], category: 'document' }
    ],
    documentMetadata: {
      documentType: 'ticket',
      title: 'IndiGo Flight Boarding Pass HYD -> GOX',
      vendor: 'IndiGo Airlines',
      date: 'December 18, 2025',
      invoiceNumber: 'PNR: X89QW2',
      productName: 'Flight 6E 428 Seat 12F',
      importantEntities: {
        'Flight Number': '6E 428',
        'Route': 'HYD to GOX (Goa)',
        'Seat': '12F Window',
        'Departure': '06:50 AM'
      }
    },
    qualityScore: 93,
    fileSize: '1.9 MB',
    dimensions: { width: 3024, height: 4032 },
    aiDescription: 'IndiGo flight boarding pass for trip to Goa with PNR X89QW2 departing from Hyderabad airport.',
    album: 'Goa Holiday'
  },
  {
    id: 'luma-010',
    title: 'Red Audi RS5 Coupe Near Glass Tower',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-07-15T15:20:00Z',
    location: {
      name: 'HITEC City Cyber Towers',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4504,
      longitude: 78.3808
    },
    camera: {
      make: 'Sony',
      model: 'Alpha 7 IV',
      iso: 80,
      aperture: 'f/2.2',
      focalLength: '35mm'
    },
    ocrText: 'RS 5 QUATTRO',
    detectedObjects: ['red car', 'sports coupe', 'luxury car', 'glass building', 'corporate plaza', 'vehicle'],
    semanticTags: ['automotive', 'red car near building', 'sports car', 'luxury', 'Hyderabad', 'July 2026'],
    boundingBoxes: [
      { label: 'Red Sports Car', confidence: 0.98, box: [30, 10, 85, 90], category: 'vehicle' },
      { label: 'Glass Skyscraper', confidence: 0.94, box: [5, 10, 45, 90], category: 'nature' }
    ],
    qualityScore: 97,
    fileSize: '4.8 MB',
    dimensions: { width: 4000, height: 2667 },
    aiDescription: 'Bright red performance sports car parked beside a shimmering glass architectural corporate building.',
    album: 'Supercars & Drives'
  },
  {
    id: 'luma-011',
    title: 'Artisan Wood-Fired Margherita Pizza & Basil',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-01T19:40:00Z',
    location: {
      name: 'Terraza Woodfire Trattoria',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4350,
      longitude: 78.4100
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 200,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: 'PIZZA TERRAZA 1889',
    detectedObjects: ['pizza', 'cheese', 'crust', 'basil', 'dining table', 'food'],
    semanticTags: ['food', 'pizza receipt', 'Italian dining', 'dinner with friends', 'woodfired pizza', 'August 2026'],
    boundingBoxes: [
      { label: 'Neapolitan Pizza', confidence: 0.99, box: [15, 15, 85, 85], category: 'food' }
    ],
    qualityScore: 93,
    fileSize: '3.4 MB',
    dimensions: { width: 3840, height: 2880 },
    aiDescription: 'Fresh bubbling mozzarella Margherita pizza with blistered artisan crust and olive oil drizzle.',
    album: 'Culinary Memories'
  },
  {
    id: 'luma-012',
    title: 'MacBook Pro Setup with Espresso Coffee Cup',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-20T09:30:00Z',
    location: {
      name: 'Roastery Coffee House',
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.4285,
      longitude: 78.4120
    },
    camera: {
      make: 'Fujifilm',
      model: 'X-T5',
      iso: 160,
      aperture: 'f/2.0',
      focalLength: '35mm'
    },
    ocrText: 'const aiMemory = new NeuralGraphEngine({ models: "gemini-3.7" });',
    detectedObjects: ['laptop', 'MacBook', 'coffee cup', 'espresso', 'wooden table', 'code editor', 'glasses'],
    semanticTags: ['workspace', 'coding', 'coffee', 'laptop desk', 'developer', 'August 2026'],
    boundingBoxes: [
      { label: 'Laptop', confidence: 0.98, box: [20, 20, 80, 80], category: 'object' },
      { label: 'Coffee Cup', confidence: 0.95, box: [50, 75, 75, 95], category: 'food' }
    ],
    qualityScore: 95,
    fileSize: '4.1 MB',
    dimensions: { width: 4500, height: 3000 },
    aiDescription: 'Clean minimalist workspace featuring modern laptop running code alongside a steaming ceramic cup of coffee.',
    album: 'Work & Projects'
  },
  {
    id: 'luma-013',
    title: 'Republic of India Passport Information Page',
    type: 'document',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
    timestamp: '2025-11-10T14:00:00Z',
    location: {
      name: 'Document Safe',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'Document Scanner',
      model: 'CamScan Secure',
    },
    ocrText: 'REPUBLIC OF INDIA / PASSPORT\nTYPE: P | COUNTRY CODE: IND | PASSPORT NO: Z8492019\nSURNAME: SYED | GIVEN NAME: ABDUL\nNATIONALITY: INDIAN | SEX: M\nDATE OF BIRTH: 14/08/1996\nPLACE OF BIRTH: HYDERABAD, TELANGANA\nDATE OF ISSUE: 10/11/2021 | DATE OF EXPIRY: 09/11/2031\nISSUING AUTHORITY: PASSPORT OFFICE HYDERABAD\nP<INDSYED<<ABDUL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\nZ8492019<2IND9608144M3111096<<<<<<<<<<<<<<04',
    detectedObjects: ['passport', 'identity document', 'official passport page', 'MRZ code', 'government ID'],
    semanticTags: ['passport', 'identity', 'travel document', 'passport number Z8492019', 'official', 'confidential'],
    boundingBoxes: [
      { label: 'Passport Identity Page', confidence: 0.99, box: [15, 10, 85, 90], category: 'document' }
    ],
    documentMetadata: {
      documentType: 'id_card',
      title: 'Indian Passport Identification Page',
      vendor: 'Govt of India Ministry of External Affairs',
      date: 'November 10, 2021',
      invoiceNumber: 'Passport No: Z8492019',
      importantEntities: {
        'Passport Number': 'Z8492019',
        'Full Name': 'Syed Abdul',
        'Valid Until': '09/11/2031',
        'Place of Issue': 'Hyderabad'
      }
    },
    qualityScore: 94,
    fileSize: '2.1 MB',
    dimensions: { width: 3000, height: 2000 },
    aiDescription: 'Official Republic of India passport document scan containing passport number Z8492019 and personal data.',
    album: 'Official Documents'
  },
  {
    id: 'luma-014',
    title: 'Amazon Order Invoice — Steelbird Motorcycle Helmet',
    type: 'receipt',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-07-04T12:15:00Z',
    location: {
      name: 'Amazon India Fulfillment Center',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'System Screenshot',
      model: 'Display Capture',
    },
    ocrText: 'AMAZON.IN ORDER TAX INVOICE\nORDER # 408-9821094-1182390\nORDER DATE: 04 JULY 2026\nDELIVERY ADDRESS: HYDERABAD, 500033\nITEM: STEELBIRD SBA-7 7WINGS ISI CERTIFIED MOTORCYCLE HELMET MATTE BLACK\nSOLD BY: RIDER HUB RETAIL\nQUANTITY: 1\nTOTAL: ₹3,299.00 (INCLUSIVE OF GST)\nPAYMENT METHOD: AMAZON PAY UPI\nSTATUS: DELIVERED',
    detectedObjects: ['receipt', 'invoice', 'shopping screenshot', 'Amazon bill', 'helmet order'],
    semanticTags: ['shopping', 'Amazon receipt', 'motorcycle gear', 'helmet', 'expense', 'July 2026'],
    boundingBoxes: [
      { label: 'Order Summary', confidence: 0.99, box: [15, 10, 85, 90], category: 'document' }
    ],
    documentMetadata: {
      documentType: 'receipt',
      title: 'Amazon Order — Steelbird Motorcycle Helmet',
      vendor: 'Amazon India / Rider Hub',
      amount: '₹3,299',
      currency: 'INR',
      date: 'July 4, 2026',
      invoiceNumber: '408-9821094-1182390',
      productName: 'Steelbird SBA-7 7Wings Motorcycle Helmet Matte Black',
      importantEntities: {
        'Order ID': '408-9821094-1182390',
        'Amount': '₹3,299',
        'Item': 'Steelbird Motorcycle Helmet',
        'Status': 'Delivered'
      }
    },
    qualityScore: 91,
    fileSize: '1.2 MB',
    dimensions: { width: 1179, height: 2556 },
    aiDescription: 'Amazon tax invoice for motorcycle helmet purchase totaling ₹3,299.',
    album: 'Receipts & Invoices'
  },
  {
    id: 'luma-015',
    title: 'Dog Sleeping Lazily on Cozy Living Room Sofa',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-25T14:30:00Z',
    location: {
      name: 'Living Room',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 16 Pro',
      iso: 125,
      aperture: 'f/1.78',
      focalLength: '24mm'
    },
    ocrText: '',
    detectedObjects: ['dog', 'sleeping dog', 'golden retriever', 'sofa', 'cushions', 'living room'],
    semanticTags: ['pets', 'dog sleeping on sofa', 'cozy home', 'relaxation', 'cute animal', 'August 2026'],
    boundingBoxes: [
      { label: 'Sleeping Dog', confidence: 0.98, box: [25, 20, 80, 85], category: 'animal' },
      { label: 'Sofa & Blanket', confidence: 0.95, box: [15, 10, 90, 90], category: 'object' }
    ],
    qualityScore: 92,
    fileSize: '3.3 MB',
    dimensions: { width: 4032, height: 3024 },
    aiDescription: 'Cute golden retriever dog peacefully napping curled up on a grey velvet living room couch.',
    album: 'Pet Moments'
  },
  {
    id: 'luma-016',
    title: 'Katiki Waterfalls Trek in Araku Valley',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-02-15T11:45:00Z',
    location: {
      name: 'Katiki Waterfalls, Araku',
      city: 'Araku Valley',
      country: 'India',
      latitude: 18.2831,
      longitude: 83.0112
    },
    camera: {
      make: 'Fujifilm',
      model: 'X-T5',
      iso: 100,
      aperture: 'f/5.6',
      focalLength: '18mm'
    },
    ocrText: 'KATIKI WATERFALLS 50FT GHOSTHI RIVER',
    detectedObjects: ['waterfall', 'stream', 'rocks', 'jungle', 'hiking trail', 'nature'],
    semanticTags: ['travel', 'waterfall', 'Araku Valley', 'trekking', 'nature', 'Feb 2026'],
    boundingBoxes: [
      { label: 'Cascading Waterfall', confidence: 0.97, box: [10, 20, 85, 80], category: 'nature' }
    ],
    qualityScore: 96,
    isFavorite: true,
    fileSize: '5.2 MB',
    dimensions: { width: 4160, height: 6240 },
    aiDescription: 'Majestic 50-foot natural waterfall flowing through rock boulders and green foliage in Araku.',
    album: 'Araku Valley Road Trip'
  },
  {
    id: 'luma-017',
    title: 'UPI Payment Receipt for Grocery Shopping',
    type: 'receipt',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-26T18:15:00Z',
    location: {
      name: 'Nature Basket Supermarket',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'System Screenshot',
      model: 'Display Capture',
    },
    ocrText: 'GOOGLE PAY - UPI TRANSACTION SUCCESSFUL\nPAID TO: NATURES BASKET RETAIL HYD\nAMOUNT: ₹1,250.00\nUPI TRANSACTION ID: 498239019284\nGOOGLE TRANSACTION ID: CICAgPDu8_j9fQ\nPAID FROM: HDFC BANK ACCOUNT **4912\nDATE: 26 AUG 2026, 06:15 PM',
    detectedObjects: ['payment receipt', 'Google Pay screenshot', 'UPI transfer', 'transaction success'],
    semanticTags: ['payment screenshot', 'grocery receipt', 'UPI', '₹1250', 'August 2026', 'finance'],
    boundingBoxes: [
      { label: 'Payment Success Dialog', confidence: 0.99, box: [15, 10, 85, 90], category: 'text' }
    ],
    documentMetadata: {
      documentType: 'receipt',
      title: 'Google Pay — Nature Basket Grocery',
      vendor: 'Natures Basket Retail',
      amount: '₹1,250',
      currency: 'INR',
      date: 'August 26, 2026',
      invoiceNumber: 'UPI ID: 498239019284',
      productName: 'Weekly Organic Groceries & Dairy',
      importantEntities: {
        'Transaction ID': '498239019284',
        'Amount Paid': '₹1,250',
        'Payment App': 'Google Pay UPI'
      }
    },
    qualityScore: 90,
    fileSize: '760 KB',
    dimensions: { width: 1179, height: 2556 },
    aiDescription: 'UPI payment confirmation screenshot on Google Pay for ₹1,250 paid to Nature Basket.',
    album: 'Receipts & Invoices'
  },
  {
    id: 'luma-018',
    title: 'Duplicate Shot of Honda Bike (Blurry Angle)',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=40',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=40',
    timestamp: '2026-08-10T16:45:04Z',
    location: {
      name: 'Jubilee Hills Art District',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'Sony',
      model: 'Alpha 7 IV',
      iso: 100,
      aperture: 'f/1.8',
      focalLength: '50mm'
    },
    ocrText: 'HONDA CB350',
    detectedObjects: ['motorcycle', 'Honda bike', 'vehicle'],
    semanticTags: ['duplicate', 'burst photo', 'motorcycle', 'cleanup target'],
    qualityScore: 54,
    isDuplicate: true,
    duplicateOfId: 'luma-001',
    fileSize: '4.0 MB',
    dimensions: { width: 4000, height: 2667 },
    aiDescription: 'Burst duplicate photo of the Honda CB350 with slight motion shake.',
    album: 'Motorcycle Adventures'
  },
  {
    id: 'luma-019',
    title: 'Accidental Pocket Screenshot',
    type: 'screenshot',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=50',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=500&q=50',
    timestamp: '2026-08-22T13:10:00Z',
    camera: {
      make: 'System Screenshot',
      model: 'Accidental Lock Screen',
    },
    ocrText: '13:10\nSwipe up to unlock\nEmergency Call',
    detectedObjects: ['lockscreen', 'blurry screenshot', 'accidental capture'],
    semanticTags: ['cleanup target', 'accidental screenshot', 'low utility'],
    qualityScore: 32,
    isBlurry: true,
    fileSize: '450 KB',
    dimensions: { width: 1179, height: 2556 },
    aiDescription: 'Low-quality accidental lockscreen capture suitable for smart cleanup.',
    album: 'Screenshots'
  },
  {
    id: 'luma-020',
    title: 'DHL Express Package Tracking Number Screenshot',
    type: 'screenshot',
    url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=500&q=80',
    timestamp: '2026-08-18T10:05:00Z',
    location: {
      name: 'Hyderabad Logistics Hub',
      city: 'Hyderabad',
      country: 'India'
    },
    camera: {
      make: 'System Screenshot',
      model: 'Display Capture',
    },
    ocrText: 'DHL EXPRESS SHIPMENT TRACKING\nWAYBILL TRACKING NUMBER: 9938210934\nESTIMATED DELIVERY: 20-AUG-2026 BY END OF DAY\nORIGIN: TOKYO, JAPAN\nDESTINATION: HYDERABAD, INDIA\nSTATUS: CUSTOMS CLEARED AT BANGALORE GATEWAY\nSIGNATURE REQUIRED ON DELIVERY',
    detectedObjects: ['screenshot', 'shipping tracking', 'tracking number', 'DHL express', 'delivery status'],
    semanticTags: ['tracking number', 'courier', 'DHL 9938210934', 'shipment', 'screenshot', 'August 2026'],
    boundingBoxes: [
      { label: 'Tracking Number', confidence: 0.99, box: [20, 15, 60, 85], category: 'text' }
    ],
    documentMetadata: {
      documentType: 'ticket',
      title: 'DHL Express Waybill Tracking #9938210934',
      vendor: 'DHL Express',
      date: 'August 18, 2026',
      invoiceNumber: '9938210934',
      productName: 'International Tokyo Express Package',
      importantEntities: {
        'Tracking Number': '9938210934',
        'Carrier': 'DHL Express',
        'Status': 'Customs Cleared',
        'ETA': '20-AUG-2026'
      }
    },
    qualityScore: 92,
    fileSize: '920 KB',
    dimensions: { width: 1179, height: 2556 },
    aiDescription: 'DHL Express courier tracking page displaying tracking number 9938210934.',
    album: 'Screenshots'
  }
];

export const SEED_MEMORY_EVENTS: MemoryEvent[] = [
  {
    id: 'mem-001',
    title: 'Honda Motorcycle Maintenance & Battery Upgrade',
    dateRange: 'August 10 – 12, 2026',
    startDate: '2026-08-10',
    location: 'ABC Motors & Jubilee Hills, Hyderabad',
    itemIds: ['luma-001', 'luma-002', 'luma-003'],
    coverItemId: 'luma-001',
    theme: 'maintenance',
    description: 'Replaced old bike battery with high-performance Exide XLTZ9 12V 9Ah battery at ABC Motors for ₹4,500.',
    tags: ['Motorcycle', 'Honda CB350', 'Battery Replacement', 'ABC Motors', 'Receipt ₹4,500']
  },
  {
    id: 'mem-002',
    title: 'Valentine Weekend Escape to Araku Valley',
    dateRange: 'February 14 – 15, 2026',
    startDate: '2026-02-14',
    location: 'Araku Valley & Katiki Falls, Andhra Pradesh',
    itemIds: ['luma-007', 'luma-016'],
    coverItemId: 'luma-007',
    theme: 'trip',
    description: 'Road trip into misty coffee hills, organic plantations, and trekking up to 50ft Katiki waterfalls.',
    tags: ['Road Trip', 'Araku Valley', 'Mountains', 'Coffee Estate', 'Katiki Falls']
  },
  {
    id: 'mem-003',
    title: 'Year-End Coastal Holiday in Goa',
    dateRange: 'December 18 – 22, 2025',
    startDate: '2025-12-18',
    location: 'Anjuna Beach, Goa',
    itemIds: ['luma-005', 'luma-009'],
    coverItemId: 'luma-005',
    theme: 'trip',
    description: 'Flew IndiGo 6E 428 to Goa. Sunset walks with retriever on Anjuna beach and seaside dining.',
    tags: ['Goa Holiday', 'Anjuna Beach', 'Golden Retriever', 'IndiGo Flight', 'December 2025']
  },
  {
    id: 'mem-004',
    title: 'Heritage Hyderabadi Biryani & Culinary Trail',
    dateRange: 'June 14, 2026',
    startDate: '2026-06-14',
    location: 'Paradise Food Court, Secunderabad',
    itemIds: ['luma-006', 'luma-011'],
    coverItemId: 'luma-006',
    theme: 'dining',
    description: 'Exploring iconic culinary spots in Hyderabad from authentic Dum Mutton Biryani to wood-fired pizza.',
    tags: ['Food Trail', 'Biryani', 'Paradise Restaurant', 'Hyderabad Food']
  }
];

export const SEED_LIFE_RECAPS: LifeRecap[] = [
  {
    period: 'month',
    title: 'August 2026 Visual Recap',
    subtitle: 'A month of machine upgrades, workspace focus & cozy moments',
    dateStr: 'August 2026',
    stats: {
      totalPhotos: 2842,
      screenshots: 487,
      trips: 3,
      restaurants: 14,
      topSubject: 'Honda Motorcycle & Maintenance'
    },
    highlights: ['luma-001', 'luma-002', 'luma-003', 'luma-012', 'luma-015', 'luma-017'],
    narrative: 'Your most photographed subject this month was your Honda CB350 motorcycle. You logged maintenance at ABC Motors with a new battery installation (₹4,500 receipt indexed), captured peaceful afternoons with your dog at home, and worked from aesthetic coffee houses in Jubilee Hills.',
    themeColor: '#06b6d4'
  },
  {
    period: 'year',
    title: '2025 – 2026 Odyssey',
    subtitle: 'From the beaches of Goa to the misty hills of Araku',
    dateStr: '2025 – 2026',
    stats: {
      totalPhotos: 8520,
      screenshots: 1240,
      trips: 8,
      restaurants: 46,
      topSubject: 'Travel & Automotive'
    },
    highlights: ['luma-005', 'luma-007', 'luma-001', 'luma-010', 'luma-009'],
    narrative: 'Across the past year, your visual memory recorded journeys across 4 states, flight routes from Hyderabad to Goa, comprehensive vehicle upgrades, and hundreds of memorable meals. Everything is indexed and instantly searchable.',
    themeColor: '#8b5cf6'
  }
];

export const SEED_KNOWLEDGE_GRAPH = {
  nodes: [
    { id: 'n-honda', label: 'Honda Motorcycle', type: 'Object', color: '#06b6d4', count: 6 },
    { id: 'n-cb350', label: 'Honda CB350', type: 'Object', color: '#38bdf8', count: 4 },
    { id: 'n-battery', label: 'Battery Replacement', type: 'Event', color: '#f59e0b', count: 3 },
    { id: 'n-receipt', label: 'ABC Motors Invoice (₹4,500)', type: 'Document', color: '#10b981', count: 2 },
    { id: 'n-hyd', label: 'Hyderabad', type: 'Place', color: '#a855f7', count: 12 },
    { id: 'n-aug26', label: 'August 2026', type: 'Date', color: '#ec4899', count: 9 },
    { id: 'n-dog', label: 'Golden Retriever', type: 'Object', color: '#f97316', count: 5 },
    { id: 'n-goa', label: 'Goa (Anjuna Beach)', type: 'Place', color: '#6366f1', count: 4 },
    { id: 'n-araku', label: 'Araku Valley', type: 'Place', color: '#14b8a6', count: 3 },
    { id: 'n-wifi', label: 'WiFi Password', type: 'Document', color: '#e11d48', count: 1 },
    { id: 'n-biryani', label: 'Paradise Biryani', type: 'Object', color: '#fbbf24', count: 2 }
  ] as KnowledgeNode[],
  edges: [
    { source: 'n-honda', target: 'n-cb350', label: 'model' },
    { source: 'n-cb350', target: 'n-battery', label: 'serviced with' },
    { source: 'n-battery', target: 'n-receipt', label: 'billed as' },
    { source: 'n-receipt', target: 'n-hyd', label: 'purchased in' },
    { source: 'n-receipt', target: 'n-aug26', label: 'dated' },
    { source: 'n-honda', target: 'n-hyd', label: 'ridden in' },
    { source: 'n-dog', target: 'n-goa', label: 'traveled to' },
    { source: 'n-goa', target: 'n-hyd', label: 'flight from' },
    { source: 'n-araku', target: 'n-hyd', label: 'road trip from' },
    { source: 'n-biryani', target: 'n-hyd', label: 'dined in' },
    { source: 'n-wifi', target: 'n-hyd', label: 'home network in' }
  ] as KnowledgeEdge[]
};
