export type Language = 'ar' | 'fr';

export type TabId = 'home' | 'activities' | 'contact';

export interface ActivityItem {
  id: string;
  title: string;
  iconName: 'heart' | 'hand' | 'users' | 'medkit' | 'truck' | 'baby' | 'gift' | 'shield';
  description: string;
  tag: string;
  stats?: string;
  highlights: string[];
  equipmentOrServices?: string[];
  actionType: 'request_aid' | 'donate' | 'volunteer' | 'call';
}

export interface UrgentAppeal {
  id: string;
  title: string;
  category: 'medical' | 'social' | 'emergency';
  targetAmountOrItem: string;
  urgency: 'high' | 'medium';
  description: string;
  date: string;
  verified: boolean;
}

export interface DonationSubmission {
  id: string;
  fullName: string;
  phoneNumber: string;
  wilaya: string;
  donationType: 'medical_equipment' | 'medicines' | 'infant_formula' | 'food_supplies' | 'clothing' | 'financial_support' | 'other';
  itemDetails: string;
  deliveryMethod: 'deliver_to_hammadi' | 'need_pickup' | 'call_first';
  notes?: string;
  createdAt: string;
}

export interface AssistanceRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  cityOrTown: string;
  assistanceType: 'medical_borrow' | 'chronic_medicine' | 'baby_milk' | 'social_basket' | 'orphan_support' | 'other';
  patientAgeOrDetails: string;
  medicalDocAttached?: boolean;
  notes?: string;
  status: 'pending' | 'reviewing';
  createdAt: string;
}

export interface VolunteerSubmission {
  id: string;
  fullName: string;
  phoneNumber: string;
  age: string;
  professionOrSkills: string;
  availability: 'weekends' | 'evenings' | 'flexible' | 'campaigns_only';
  interests: string[];
  createdAt: string;
}
