import type { LucideProps } from "lucide-react";
import type { ReactElement } from "react";

export interface UserType {
  username?: string;
  email: string;
  password: string;
  company_id?: string;
  role?: string;
  religion?: string;
  code?: string;
  country_code: string;
  id: string;
  free_days?: number;
}
export type LoginType = {
  email: string;
  password: string;
};

export interface RequestTimeOffType {
  status: string;
  start_date: string;
  end_date: string;
}
export interface TimeOff {
  start_date: string;
  end_date: string;
  status: "accepted";
  leave_type: string;
}

export interface Employee {
  user_id: string;
  username: string;
  email: string;
  leaves: TimeOff[];
  daysOff?: Record<string, string>;
  country_code: string;
}

export type TimeOffRequest = {
  id?: string | undefined;
  username?: string;
  email?: string;
  leave_type: string;
  status: string;
  start_date: string;
  end_date: string;
  reason?: string | undefined;
};

export interface PublicHolidayType {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
}
export interface CurrentCompanyType {
  name: string;
}
export interface AllEmployeeType {
  user_id: string;
  username: string;
  email: string;
  role: string;
  country_code: string;
  worked_minutes: string;
  free_days: number;
}
export interface EmployeeCountryHolidayType {
  countryCode: string;
  date: string;
  localName: string;
}
export interface FeatureCardTypes {
   icon: ReactElement<LucideProps>; 
  title: string;
  text: string;
}
export interface BentoItemProps {
  icon: React.ReactNode; 
  title: string;
  desc: string;
}
export interface CheckItemProps {
  text: string;
  dark?: boolean; 
}

export interface InputGroupTypes {
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder: string;
  value: string | undefined;
  onChange: (value: string) => void;
}
export interface WorkEntryType {
  id: string;
  user_id: string;
  company_id: string;
  work_date: string;      
  start_time: string;     
  end_time: string | null;  
  break_start: string | null; 
  break_end: string | null;
  totalBreak: number;    
  total_minutes: number; 
  workedMinutes: number; 
  worked_minutes?: number; 
}
export interface NotificationType {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

