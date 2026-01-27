export interface userType {
  username?: string;
  email: string;
  password: string;
  company_id?: string;
  role?: string;
  religion?: string;
  code?: string;
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
}

export interface Employee {
  user_id: string;
  username: string;
  email: string;
  leaves: TimeOff[];
  daysOff?: string[];
}

export type TimeOffRequest = {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  username: string;
  email: string;
};
