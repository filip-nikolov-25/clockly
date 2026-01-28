export interface userType {
  username?: string;
  email: string;
  password: string;
  company_id?: string;
  role?: string;
  religion?: string;
  code?: string;
  country_code:string
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
  leave_type:string
}

export interface Employee {
  user_id: string;
  username: string;
  email: string;
  leaves: TimeOff[];
  daysOff?: string[];
  country_code:string
}

export type TimeOffRequest = {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  username: string;
  email: string;
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

