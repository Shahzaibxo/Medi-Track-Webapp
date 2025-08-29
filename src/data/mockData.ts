import { Medicine, Strip, StripDetail } from '../types';

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Aspirin 100mg',
    description: 'Pain relief and anti-inflammatory medication',
    manufacturer: 'PharmaCorp Ltd.',
    category: 'Analgesics',
    dosageForm: 'Tablet',
    strength: '100mg',
    createdAt: '2024-01-15T10:00:00Z',
    stripCount: 45
  },
  {
    id: '2',
    name: 'Metformin 500mg',
    description: 'Diabetes medication for blood sugar control',
    manufacturer: 'DiabetoCare Inc.',
    category: 'Antidiabetic',
    dosageForm: 'Tablet',
    strength: '500mg',
    createdAt: '2024-01-16T14:30:00Z',
    stripCount: 32
  },
  {
    id: '3',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor for blood pressure management',
    manufacturer: 'CardioMed Solutions',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '10mg',
    createdAt: '2024-01-18T09:15:00Z',
    stripCount: 28
  },
  {
    id: '4',
    name: 'Amoxicillin 250mg',
    description: 'Broad-spectrum antibiotic',
    manufacturer: 'AntiBio Pharmaceuticals',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '250mg',
    createdAt: '2024-01-20T16:45:00Z',
    stripCount: 67
  }
];

export const mockStrips: Strip[] = [
  {
    id: 'strip-1',
    medicineId: '1',
    batchNumber: 'ASP-001-2024',
    expiryDate: '2025-12-31',
    manufacturingDate: '2024-01-10',
    quantity: 10,
    price: 5.99,
    location: 'Warehouse A - Shelf 12',
    status: 'available'
  },
  {
    id: 'strip-2',
    medicineId: '1',
    batchNumber: 'ASP-002-2024',
    expiryDate: '2025-11-30',
    manufacturingDate: '2024-01-08',
    quantity: 3,
    price: 5.99,
    location: 'Warehouse A - Shelf 12',
    status: 'low-stock'
  },
  {
    id: 'strip-3',
    medicineId: '2',
    batchNumber: 'MET-001-2024',
    expiryDate: '2026-06-15',
    manufacturingDate: '2024-01-12',
    quantity: 15,
    price: 12.50,
    location: 'Warehouse B - Shelf 5',
    status: 'available'
  },
  {
    id: 'strip-4',
    medicineId: '2',
    batchNumber: 'MET-002-2024',
    expiryDate: '2026-05-20',
    manufacturingDate: '2024-01-14',
    quantity: 8,
    price: 12.50,
    location: 'Warehouse B - Shelf 5',
    status: 'available'
  },
  {
    id: 'strip-5',
    medicineId: '3',
    batchNumber: 'LIS-001-2024',
    expiryDate: '2025-09-10',
    manufacturingDate: '2024-01-16',
    quantity: 12,
    price: 8.75,
    location: 'Warehouse C - Shelf 8',
    status: 'available'
  }
];

export const getStripDetail = (stripId: string): StripDetail | undefined => {
  const strip = mockStrips.find(s => s.id === stripId);
  if (!strip) return undefined;

  return {
    ...strip,
    barcode: `BC-${strip.id.toUpperCase()}-${strip.batchNumber}`,
    supplier: 'MedSupply International',
    notes: 'Store in cool, dry place. Keep away from direct sunlight.',
    lastUpdated: '2024-01-25T08:30:00Z'
  };
};

export const getStripsByMedicine = (medicineId: string): Strip[] => {
  return mockStrips.filter(strip => strip.medicineId === medicineId);
};