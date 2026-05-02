export interface Contract {
  contractNumber: string;
  name: string;
  partner: string;
  validFrom: Date;
  validUntil: Date;
  budget: number;
  status: string;
  serviceType?: string;
  description?: string;
}

export const CONTRACTS: Contract[] = [
  {
    contractNumber: 'ZML-2024-001',
    name: 'IT podpora a správa systémov',
    partner: 'TechSupport s.r.o.',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    budget: 15000,
    status: 'Aktívna',
    serviceType: 'IT podpora',
    description: 'Zmluva na poskytovanie IT podpory a správy informačných systémov organizácie.',
  },
  {
    contractNumber: 'ZML-2024-002',
    name: 'Upratovanie a čistenie priestorov',
    partner: 'CleanPro a.s.',
    validFrom: new Date('2024-03-01'),
    validUntil: new Date('2025-02-28'),
    budget: 8400,
    status: 'Aktívna',
    serviceType: 'Upratovanie',
    description: 'Zmluva na pravidelné upratovanie a čistenie pracovných priestorov.',
  },
  {
    contractNumber: 'ZML-2023-047',
    name: 'Dodávka zdravotníckeho materiálu',
    partner: 'MedSupply s.r.o.',
    validFrom: new Date('2023-06-01'),
    validUntil: new Date('2024-05-31'),
    budget: 32000,
    status: 'Ukončená',
    serviceType: 'Dodávka materiálu',
    description: 'Zmluva na pravidelné dodávky zdravotníckeho a sanitárneho materiálu.',
  },
];
