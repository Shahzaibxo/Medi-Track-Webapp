import { useState, useCallback, useEffect } from 'react';
import { Medicine, Strip, CreateMedicineRequest, UpdateMedicineRequest, MedicineListingRequest } from '../types';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [strips, setStrips] = useState<Strip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch medicines from API
  const fetchMedicines = useCallback(async (filters: MedicineListingRequest = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Always include the current user's company in the filters
      const filtersWithCompany = {
        ...filters,
        company: user?.companyName || ''
      };
      
      const response = await ApiService.getMedicines(filtersWithCompany);
      const transformedMedicines: Medicine[] = response.data?.map((item: any) => ({
        id: item.id,
        name: item.name,
        formula: item.formula || 'No formula available',
        company: item.company.companyName || 'Unknown company',
        createdAt: item.createdAt || new Date().toISOString(),
        image: item.image || undefined
      })) || [];
      
      setMedicines(transformedMedicines);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch medicines');
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.companyName]);

  // Load medicines on mount
  useEffect(() => {
    if (user?.companyName) {
      fetchMedicines();
    }
  }, [fetchMedicines, user?.companyName]);

  const addMedicine = useCallback(async (medicineData: CreateMedicineRequest, imageFile: File) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.createMedicine(medicineData, imageFile);
      
      // Refresh the medicines list to get the updated data
      await fetchMedicines();
      
      return medicineData;
    } catch (err: any) {
      setError(err.message || 'Failed to add medicine');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMedicines]);

  const updateMedicine = useCallback(async (medicineId: string, medicineData: UpdateMedicineRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.updateMedicine(medicineId, medicineData);
      
      // Update local state
      setMedicines(prev => prev.map(medicine => 
        medicine.id === medicineId 
          ? { 
              ...medicine, 
              name: medicineData.name || medicine.name,
              formula: medicineData.formula || medicine.formula
            }
          : medicine
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update medicine');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMedicine = useCallback(async (medicineId: string) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.deleteMedicine(medicineId);
      
      // Remove from local state
      setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete medicine');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addStrip = useCallback((stripData: Omit<Strip, 'id'>) => {
    const newStrip: Strip = {
      ...stripData,
      id: `strip-${Date.now()}`
    };
    
    setStrips(prev => [...prev, newStrip]);
    
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
    loading,
    error,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addStrip,
    getStripsByMedicine,
    getMedicineById,
    getStripById,
    fetchMedicines,
    clearError: () => setError(null)
  };
};