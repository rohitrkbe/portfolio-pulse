import type { Client } from '@/types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c001', name: 'Arjun Mehta',   clientId: 'HNI-2341', aum: 125_000_000, currency: 'INR',
    riskProfile: 'Aggressive',   returnOneMonth: 2.4,  returnYTD: 14.8, requiresRebalancing: true,
    lastReviewedAt: '2026-05-15', rmId: 'rm001', phone: '+91 98765 43210',
    email: 'arjun.mehta@private.in',  joinedAt: '2019-03-12', city: 'Mumbai',
  },
  {
    id: 'c002', name: 'Priya Sharma',  clientId: 'HNI-1892', aum:  82_000_000, currency: 'INR',
    riskProfile: 'Moderate',     returnOneMonth: 1.2,  returnYTD:  9.4, requiresRebalancing: false,
    lastReviewedAt: '2026-06-01', rmId: 'rm001', phone: '+91 98765 11111',
    email: 'priya.sharma@private.in', joinedAt: '2020-07-22', city: 'Delhi',
  },
  {
    id: 'c003', name: 'Rajesh Kapoor', clientId: 'HNI-0987', aum: 220_000_000, currency: 'INR',
    riskProfile: 'Conservative', returnOneMonth: 0.9,  returnYTD:  7.2, requiresRebalancing: true,
    lastReviewedAt: '2026-04-20', rmId: 'rm001', phone: '+91 98765 22222',
    email: 'rajesh.kapoor@private.in', joinedAt: '2017-11-05', city: 'Bangalore',
  },
  {
    id: 'c004', name: 'Anita Desai',   clientId: 'HNI-3456', aum: 157_000_000, currency: 'INR',
    riskProfile: 'Moderate',     returnOneMonth: 1.8,  returnYTD: 12.3, requiresRebalancing: false,
    lastReviewedAt: '2026-05-28', rmId: 'rm001', phone: '+91 98765 33333',
    email: 'anita.desai@private.in',  joinedAt: '2021-02-14', city: 'Hyderabad',
  },
  {
    id: 'c005', name: 'Vikram Singh',  clientId: 'HNI-0654', aum: 310_000_000, currency: 'INR',
    riskProfile: 'Aggressive',   returnOneMonth: 3.1,  returnYTD: 21.5, requiresRebalancing: true,
    lastReviewedAt: '2026-05-10', rmId: 'rm001', phone: '+91 98765 44444',
    email: 'vikram.singh@private.in', joinedAt: '2016-08-30', city: 'Mumbai',
  },
  {
    id: 'c006', name: 'Sunita Patel',  clientId: 'HNI-2789', aum:  65_000_000, currency: 'INR',
    riskProfile: 'Conservative', returnOneMonth: 0.7,  returnYTD:  7.8, requiresRebalancing: false,
    lastReviewedAt: '2026-06-05', rmId: 'rm001', phone: '+91 98765 55555',
    email: 'sunita.patel@private.in', joinedAt: '2022-04-18', city: 'Ahmedabad',
  },
];
