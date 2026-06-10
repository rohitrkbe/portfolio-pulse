export interface MockCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    id: 'rm001',
    name: 'Rahul Verma',
    email: 'rm@portfoliopulse.in',
    password: 'Welcome@123',
    role: 'Relationship Manager',
  },
  {
    id: 'rm002',
    name: 'Priya Nair',
    email: 'priya@portfoliopulse.in',
    password: 'Demo@456',
    role: 'Senior RM',
  },
];
