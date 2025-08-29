import { useState, useCallback } from 'react';
import { Medicine, Strip } from '../types';
import { mockMedicines, mockStrips } from '../data/mockData';

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [strips, setStrips] = useState<Strip[]>(mockStrips);

  const addMedicine = useCallback((medicineData: Omit<Medicine, 'id' | 'createdAt' | 'stripCount'>) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      stripCount: 0
    };
    
    setMedicines(prev => [newMedicine, ...prev]);
    return newMedicine;
  }, []);

  const addStrip = useCallback((stripData: Omit<Strip, 'id'>) => {
    const newStrip: Strip = {
      ...stripData,
      id: `strip-${Date.now()}`
    };
    
    setStrips(prev => [...prev, newStrip]);
    
    // Update medicine strip count
    setMedicines(prev => prev.map(medicine => 
      medicine.id === stripData.medicineId 
        ? { ...medicine, stripCount: medicine.stripCount + 1 }
        : medicine
    ));
    
    return newStrip;
  }, []);

  const getStripsByMedicine = useCallback((medicineId: string) => {
    return strips.filter(strip => strip.medicineId === medicineId);
  }, [strips]);

  const getMedicineById = useCallback((medicineId: string) => {
    return medicines.find(medicine => medicine.id === medicineId);
  }, [medicines]);

  const getStripById = useCallback((stripId: string) => {
    return strips.find(strip => strip.id === stripId);
  }, [strips]);

  return {
    medicines,
    strips,
    addMedicine,
    addStrip,
    getStripsByMedicine,
    getMedicineById,
    getStripById
  };
};