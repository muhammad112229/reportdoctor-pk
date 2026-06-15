export type UserRole = "user" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp: string | null;
  role: UserRole;
  created_at?: string;
};

export type Plan = {
  id: string;
  name: string;
  price_pkr: number;
  description: string;
  report_credits: number;
  features?: string[];
  active?: boolean;
};

export type OrderStatus = "pending" | "sent_on_whatsapp" | "approved" | "rejected";

export type Order = {
  id: string;
  user_id: string;
  plan_id: string;
  amount_pkr: number;
  payment_method: string;
  payment_number: string | null;
  screenshot_url: string | null;
  status: OrderStatus;
  admin_note: string | null;
  created_at: string;
  approved_at: string | null;
  plan?: Plan | null;
  profile?: Profile | null;
};

export type ReportCredit = {
  id: string;
  user_id: string;
  order_id: string | null;
  credits_total: number;
  credits_used: number;
  status: "active" | "expired" | "cancelled";
  created_at: string;
};

export type SavedReport = {
  id: string;
  user_id: string | null;
  filename: string;
  mode: string;
  pdf_unlocked: boolean;
  created_at: string;
  profile?: Profile | null;
};

export type AccountSummary = {
  profile: Profile;
  orders: Order[];
  credits: ReportCredit[];
  reports: SavedReport[];
  available_credits: number;
};
