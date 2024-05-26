// types.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_customer: boolean;
  is_driver: boolean;
}
  
  export interface BaseProfile {
    id: number;
    user: User;
    name: string;
    surname: string;
    phone_number?: string;
    id_number_or_passport?: string;
    gender?: 'male' | 'female';
    date_of_birth?: string;  // using string to handle date formatting
    address?: string;
  }
  
  export interface PatientProfile extends BaseProfile {
    // Additional fields if any
  }
  
  export interface ConsultationCategory {
    id: number;
    name: string;
  }
  
  export interface DoctorProfile extends BaseProfile {
    specialty: string;
    years_of_experience: number;
    consultation_category?: ConsultationCategory;
  }
  
  export interface Appointment {
    patient: number;
    doctor: number;
    category: number;
    appointment_time: string;  // using string to handle date-time formatting
    status: 'scheduled' | 'cancelled' | 'completed';
    paid: boolean;
    fee: number;
  }
  export interface MedicalRecord {
    id: number;
    patient: PatientProfile;
    record_date: string;  // using string to handle date formatting
    diagnosis: string;
    treatment: string;
    doctor?: DoctorProfile;
  }
  
  export interface Billing {
    id: number;
    patient: PatientProfile;
    service_name: string;
    service_fee: number;
    billing_date: string;  // using string to handle date formatting
    paid: boolean;
  }
  
  export interface Document {
    id: number;
    user: User;
    document: string;  // URL or path to the document
    uploaded_at: string;  // using string to handle date-time formatting
  }
  
  export interface ManagementProfile extends BaseProfile {
    position: string;
  }
  
  export interface DoctorAvailability {
    id: number;
    doctor_name: string;
    doctor_surname: string;
    doctor_user_id: number;
    days_of_week: string;
    day_of_month?: number;
    start_time: string;  // using string to handle time formatting
    end_time: string;  // using string to handle time formatting
    year: number;
    month: number;
    slots: Slot[];
  }
  
  export interface Slot {
    time: Date;
    booked: boolean;
  }
  
  
  export interface Drug {
    id: number;
    name: string;
    price: number;
    quantity_available: number;
    image_urls: string[];
    description: string;
    category_name: string;
    quantity?: number; // Optional property for quantity
  }
  
  
  export interface Prescription {
    id: number;
    patient: PatientProfile;
    prescribed_by: DoctorProfile;
    drugs: PrescriptionDrug[];
    issue_date: string;  // using string to handle date formatting
    prescription_number: string;  // UUID
    notes?: string;
  }
  
  export interface PrescriptionDrug {
    id: number;
    prescription: Prescription;
    drug: Drug;
    quantity: number;
  }


  export interface AboutUsData {
    id: number;
    title: string;
    logo: string;
    back: string;
    backgroundApp: string;
    backgroundImage: string;
    about: string;
    born_date: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    linkedin: string | null;
    facebook: string;
    twitter: string;
    instagram: string;
  }