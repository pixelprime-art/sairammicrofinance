// Mock Database Service for Sairam Microfinance
// Simulates Supabase database operations using localStorage

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'customer';
  mobile?: string;
  createdAt: string;
}

export interface LoanType {
  id: string;
  name: string;
  maxAmount: number;
  interestRate: number; // yearly rate in %
  processingFee: string;
  tenureMonths: number;
  description: string;
  features: string[];
}

export interface LoanApplication {
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  loanType: string;
  amount: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEMI: number;
  occupation: string;
  employerName: string;
  experienceYears: number;
  monthlyIncome: number;
  otherIncome: number;
  documents: {
    aadhaarName: string;
    aadhaarData: string; // base64
    panName: string;
    panData: string; // base64
    photoName: string;
    photoData: string; // base64
    incomeProofName: string;
    incomeProofData: string; // base64
  };
  status: 'Pending' | 'KYC_Verified' | 'Approved' | 'Rejected';
  comments?: string;
  appliedDate: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  paidDate: string;
  status: 'Success' | 'Failed';
  transactionId: string;
}

export interface Investment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  scheme: string;
  durationYears: number;
  status: 'Pending' | 'Active';
  appliedDate: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isMain: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Read' | 'Unread';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

// Initial Data Seeds
const DEFAULT_LOAN_TYPES: LoanType[] = [
  {
    id: 'personal',
    name: 'Personal Loan',
    maxAmount: 500000,
    interestRate: 10.99,
    processingFee: '1.5%',
    tenureMonths: 60,
    description: 'Quick personal finance to meet personal obligations, medical needs, or family celebrations.',
    features: ['No collateral needed', 'Flexible tenure up to 5 years', 'Minimal documentation']
  },
  {
    id: 'business',
    name: 'Business Loan (MSME)',
    maxAmount: 2500000,
    interestRate: 12.5,
    processingFee: '2%',
    tenureMonths: 84,
    description: 'Working capital and capital expansion loans tailored for micro, small, and medium enterprises.',
    features: ['Collateral options', 'High disbursement limit', 'Direct business accounts integration']
  },
  {
    id: 'gold',
    name: 'Gold Loan',
    maxAmount: 1500000,
    interestRate: 8.99,
    processingFee: '0.5%',
    tenureMonths: 24,
    description: 'Instant credit against your gold jewelry with immediate physical valuation and vault safety.',
    features: ['Instant valuation', 'Safety guarantee', 'LTV up to 75%']
  },
  {
    id: 'education',
    name: 'Education Loan',
    maxAmount: 1000000,
    interestRate: 9.5,
    processingFee: '1%',
    tenureMonths: 120,
    description: 'Funding higher education in India and abroad for deserving students.',
    features: ['Moratorium period benefits', 'Direct fee transfers', 'Tax benefits under Sec 80E']
  },
  {
    id: 'agricultural',
    name: 'Agricultural Loan',
    maxAmount: 800000,
    interestRate: 7.99,
    processingFee: '0.75%',
    tenureMonths: 36,
    description: 'Tailored loans for farmers to purchase modern farming equipment, seeds, and fertilizer packages.',
    features: ['Subsidy aligned', 'Flexible crop cycle repayment', 'Low documentation']
  },
  {
    id: 'womens-empowerment',
    name: "Women's Empowerment Loan",
    maxAmount: 300000,
    interestRate: 9.0,
    processingFee: '0.5%',
    tenureMonths: 48,
    description: 'Special low-rate credit groups for self-help collectives, women entrepreneurs, and rural artisans.',
    features: ['No co-signer required', 'Skill mentorship links', 'Group guarantee support']
  },
  {
    id: 'emergency',
    name: 'Emergency Loan',
    maxAmount: 200000,
    interestRate: 11.5,
    processingFee: '0%',
    tenureMonths: 12,
    description: 'Immediate liquidity support for medical emergencies, hospitalization, or crop failures.',
    features: ['Instant 4-hour disbursal', 'Zero processing fee', 'Easy payback options']
  }
];

const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Corporate Head Office (Chennai)',
    address: 'SAIRAM MICROFINANCE Towers, 4th Floor, Anna Salai, Chennai, Tamil Nadu 600002',
    phone: '+91 44 2855 9000',
    email: 'corp.chennai@nayaksairam.com',
    isMain: true
  },
  {
    id: 'b2',
    name: 'Regional Office (Bengaluru)',
    address: 'No. 45, Residency Road, Opposite SBI Bank, Bengaluru, Karnataka 560025',
    phone: '+91 80 4112 3456',
    email: 'reg.bengaluru@nayaksairam.com',
    isMain: false
  },
  {
    id: 'b3',
    name: 'Hyderabad Branch Office',
    address: 'D.No. 3-6-285, Himayatnagar Main Road, Hyderabad, Telangana 500029',
    phone: '+91 40 6678 1234',
    email: 'hyd@nayaksairam.com',
    isMain: false
  },
  {
    id: 'b4',
    name: 'Coimbatore Branch Office',
    address: '102, Avinashi Road, Near PSG College, Coimbatore, Tamil Nadu 641004',
    phone: '+91 422 256 7890',
    email: 'coimbatore@nayaksairam.com',
    isMain: false
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ramesh K. Kumar',
    location: 'Coimbatore, TN',
    review: 'The agricultural loan from SAIRAM MICROFINANCE helped me purchase a modern tractor. The crop-cycle-aligned repayment schedule is extremely farmer-friendly.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    id: 't2',
    name: 'Priyanka Sen',
    location: 'Bengaluru, KA',
    review: 'As a woman entrepreneur, getting credit was always a hassle. Sairam Microfinance\'s Women Empowerment loan program trusted my vision and funded my boutique within 3 days.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    id: 't3',
    name: 'Arun Deshmukh',
    location: 'Hyderabad, TS',
    review: 'Secured an MSME business loan to expand my grocery store. The processing was smooth, transparent, and completely digital. Highly recommended financial partner.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
  {
    id: 't4',
    name: 'Meenakshi Iyer',
    location: 'Chennai, TN',
    review: 'Used the Gold Loan during a medical emergency. The security of my gold ornaments in their vault gave me peace of mind, and the interest rate was very low.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
  },
  {
    id: 't5',
    name: 'Suresh Gowda',
    location: 'Mysuru, KA',
    review: 'I financed my daughters higher studies through their Education Loan. The low interest rate and moratorium period helped me manage family expenses comfortably.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop'
  },
  {
    id: 't6',
    name: 'Rajinder Prasad',
    location: 'Guntur, AP',
    review: 'Getting crop loans from nationalized banks used to take weeks. With Sairam Microfinance, I submitted everything online and got disbursal in 24 hours.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
  }
];

const DEFAULT_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 'NSMF-98241',
    userId: 'c1',
    fullName: 'Ananth Narayanan',
    dob: '1988-05-12',
    gender: 'Male',
    mobile: '9840283741',
    email: 'ananth@example.com',
    loanType: 'personal',
    amount: 300000,
    tenureMonths: 36,
    interestRate: 10.99,
    monthlyEMI: 9819,
    occupation: 'Salaried Employee',
    employerName: 'TCS Limited',
    experienceYears: 6,
    monthlyIncome: 65000,
    otherIncome: 0,
    documents: {
      aadhaarName: 'aadhaar_front.jpg',
      aadhaarData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      panName: 'pan_card.jpg',
      panData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      photoName: 'profile_photo.jpg',
      photoData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      incomeProofName: 'salary_slip.pdf',
      incomeProofData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    },
    status: 'Pending',
    appliedDate: '2026-06-18'
  },
  {
    id: 'NSMF-77341',
    userId: 'c2',
    fullName: 'Saradha Self Help Group',
    dob: '2015-09-24',
    gender: 'Female',
    mobile: '9443578912',
    email: 'saradha.shg@example.com',
    loanType: 'womens-empowerment',
    amount: 150000,
    tenureMonths: 24,
    interestRate: 9.0,
    monthlyEMI: 6853,
    occupation: 'Self Employed (Artisans)',
    employerName: 'Saradha Crafts Collective',
    experienceYears: 10,
    monthlyIncome: 35000,
    otherIncome: 5000,
    documents: {
      aadhaarName: 'shg_aadhaar.jpg',
      aadhaarData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      panName: 'shg_pan.jpg',
      panData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      photoName: 'group_photo.jpg',
      photoData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      incomeProofName: 'passbook_records.pdf',
      incomeProofData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    },
    status: 'KYC_Verified',
    appliedDate: '2026-06-15'
  },
  {
    id: 'NSMF-52319',
    userId: 'c3',
    fullName: 'Venkatraman Swamy',
    dob: '1975-02-04',
    gender: 'Male',
    mobile: '9176398412',
    email: 'venkat.farms@example.com',
    loanType: 'agricultural',
    amount: 400000,
    tenureMonths: 36,
    interestRate: 7.99,
    monthlyEMI: 12533,
    occupation: 'Farmer',
    employerName: 'Agricultural Produce Union',
    experienceYears: 25,
    monthlyIncome: 45000,
    otherIncome: 12000,
    documents: {
      aadhaarName: 'farmer_aadhaar.jpg',
      aadhaarData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      panName: 'farmer_pan.jpg',
      panData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      photoName: 'farmer_photo.jpg',
      photoData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      incomeProofName: 'land_patta.pdf',
      incomeProofData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    },
    status: 'Approved',
    appliedDate: '2026-06-10'
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Welcome to Sairam Microfinance',
    message: 'Explore our loan products, check your eligible EMI, and start applying today!',
    date: '2026-06-19',
    isRead: false,
    type: 'info'
  },
  {
    id: 'n2',
    title: 'New Loan Scheme Active',
    message: 'Agricultural loans now start at an all-time low of 7.99% per annum.',
    date: '2026-06-17',
    isRead: false,
    type: 'success'
  }
];

// Helper to write mock tables to local storage
const loadTable = <T>(key: string, initialData: T[]): T[] => {
  const data = localStorage.getItem(`nsmf_${key}`);
  if (!data) {
    localStorage.setItem(`nsmf_${key}`, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveTable = <T>(key: string, data: T[]): void => {
  localStorage.setItem(`nsmf_${key}`, JSON.stringify(data));
};

export const mockDb = {
  // Init
  init() {
    loadTable<LoanType>('loan_types', DEFAULT_LOAN_TYPES);
    loadTable<Branch>('branches', DEFAULT_BRANCHES);
    loadTable<Testimonial>('testimonials', DEFAULT_TESTIMONIALS);
    loadTable<LoanApplication>('loan_applications', DEFAULT_LOAN_APPLICATIONS);
    loadTable<Notification>('notifications', DEFAULT_NOTIFICATIONS);
    loadTable<ContactMessage>('contact_messages', []);
    loadTable<Investment>('investments', []);

    // Create default admin user
    loadTable<User>('users', [
      {
        id: 'u-admin',
        email: 'admin@nayaksairam.com',
        fullName: 'NSMF Admin Core',
        role: 'admin',
        createdAt: '2026-06-19T00:00:00.000Z'
      }
    ]);
    // Save password separately so we don't return it in general user arrays
    if (!localStorage.getItem('nsmf_auth_admin@nayaksairam.com')) {
      localStorage.setItem('nsmf_auth_admin@nayaksairam.com', 'admin123');
    }
  },

  // Users CRUD
  getUsers(): User[] {
    return loadTable<User>('users', []);
  },

  registerUser(email: string, fullName: string, mobile: string, role: 'customer' | 'admin' = 'customer'): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      email,
      fullName,
      mobile,
      role,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveTable('users', users);
    return newUser;
  },

  // Loan Types
  getLoanTypes(): LoanType[] {
    return loadTable<LoanType>('loan_types', DEFAULT_LOAN_TYPES);
  },

  // Branches
  getBranches(): Branch[] {
    return loadTable<Branch>('branches', DEFAULT_BRANCHES);
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    return loadTable<Testimonial>('testimonials', DEFAULT_TESTIMONIALS);
  },

  // Loan Applications CRUD
  getApplications(): LoanApplication[] {
    return loadTable<LoanApplication>('loan_applications', DEFAULT_LOAN_APPLICATIONS);
  },

  createApplication(appData: Omit<LoanApplication, 'id' | 'appliedDate' | 'status'>): LoanApplication {
    const apps = this.getApplications();
    const newApp: LoanApplication = {
      ...appData,
      id: `NSMF-${Math.floor(10000 + Math.random() * 90000)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    apps.unshift(newApp);
    saveTable('loan_applications', apps);

    // Notify Admins
    this.addNotification(
      'New Loan Application Submitted',
      `Application ${newApp.id} for ₹${newApp.amount.toLocaleString('en-IN')} by ${newApp.fullName} is awaiting review.`,
      'alert'
    );

    return newApp;
  },

  updateApplicationStatus(id: string, status: LoanApplication['status'], comment?: string): LoanApplication | null {
    const apps = this.getApplications();
    const index = apps.findIndex(app => app.id === id);
    if (index === -1) return null;

    apps[index].status = status;
    if (comment) {
      apps[index].comments = comment;
    }
    saveTable('loan_applications', apps);

    // Add notification for the user
    this.addNotification(
      `Loan Application Status Update`,
      `Application ${id} status changed to ${status.replace('_', ' ')}.`,
      status === 'Approved' ? 'success' : status === 'Rejected' ? 'alert' : 'info'
    );

    return apps[index];
  },

  // Contact Messages CRUD
  getContactMessages(): ContactMessage[] {
    return loadTable<ContactMessage>('contact_messages', []);
  },

  createContactMessage(name: string, phone: string, subject: string, message: string): ContactMessage {
    const msgs = this.getContactMessages();
    const newMsg: ContactMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      status: 'Unread'
    };
    msgs.unshift(newMsg);
    saveTable('contact_messages', msgs);

    this.addNotification(
      'New Contact Message',
      `Feedback/Inquiry from ${name} received: "${subject}"`,
      'info'
    );

    return newMsg;
  },

  markContactMessageRead(id: string): void {
    const msgs = this.getContactMessages();
    const index = msgs.findIndex(m => m.id === id);
    if (index !== -1) {
      msgs[index].status = 'Read';
      saveTable('contact_messages', msgs);
    }
  },

  // Investments CRUD
  getInvestments(): Investment[] {
    return loadTable<Investment>('investments', []);
  },

  createInvestment(fullName: string, email: string, phone: string, amount: number, scheme: string, durationYears: number): Investment {
    const invs = this.getInvestments();
    const newInv: Investment = {
      id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName,
      email,
      phone,
      amount,
      scheme,
      durationYears,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    invs.unshift(newInv);
    saveTable('investments', invs);

    this.addNotification(
      'New Investment Form Received',
      `${fullName} requested an investment placement of ₹${amount.toLocaleString('en-IN')} for ${durationYears} years under ${scheme}.`,
      'info'
    );

    return newInv;
  },

  // Notifications CRUD
  getNotifications(): Notification[] {
    return loadTable<Notification>('notifications', DEFAULT_NOTIFICATIONS);
  },

  addNotification(title: string, message: string, type: Notification['type'] = 'info'): Notification {
    const notifs = this.getNotifications();
    const newNotif: Notification = {
      id: `n-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      type
    };
    notifs.unshift(newNotif);
    saveTable('notifications', notifs);
    return newNotif;
  },

  markNotificationsAsRead(): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, isRead: true }));
    saveTable('notifications', updated);
  },

  // Stats for Admin Panel
  getAdminStats() {
    const apps = this.getApplications();
    const users = this.getUsers();
    
    const totalCustomers = users.filter(u => u.role === 'customer').length + 5; // Added offset for baseline look
    const activeLoans = apps.filter(app => app.status === 'Approved').length;
    
    const loanAmountIssued = apps
      .filter(app => app.status === 'Approved')
      .reduce((sum, app) => sum + app.amount, 0);

    const pendingReview = apps.filter(app => app.status === 'Pending' || app.status === 'KYC_Verified').length;
    
    // Repayment statistics (mock data)
    const repaymentRate = 98.7; // % repayment collection rate

    return {
      totalCustomers,
      activeLoans,
      loanAmountIssued,
      pendingReview,
      repaymentRate
    };
  }
};
