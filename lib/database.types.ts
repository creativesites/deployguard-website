// Hand-authored types — run `npx supabase gen types typescript` after schema is applied
// to replace this file with generated types.

export type LicenseType   = 'dogforce_special' | 'normal'
export type LicenseTier   = 'starter' | 'professional' | 'enterprise'
export type LicenseStatus = 'preview' | 'active' | 'expired' | 'suspended'
export type TenantStatus  = 'provisioning' | 'active' | 'suspended'
export type LeadStatus    = 'new' | 'contacted' | 'converted' | 'lost'
export type EventType     = 'page_view' | 'cta_click' | 'demo_page' | 'form_submit' | 'feature_click'

export interface Tenant {
  id:               string
  name:             string
  subdomain:        string
  owner_email:      string
  odoo_db_name:     string | null
  status:           TenantStatus
  provisioned_at:   string | null
  phone:            string | null
  country:          string | null
  created_at:       string
}

export interface License {
  id:                       string
  key:                      string
  tenant_id:                string
  type:                     LicenseType
  tier:                     LicenseTier | null
  status:                   LicenseStatus
  preview_expires_at:       string | null
  subscription_expires_at:  string | null
  guard_limit:              number
  stripe_subscription_id:   string | null
  stripe_customer_id:       string | null
  created_at:               string
  updated_at:               string
}

export interface Lead {
  id:                     string
  company_name:           string
  contact_name:           string | null
  email:                  string
  phone:                  string
  country:                string | null
  guard_count:            number | null
  message:                string | null
  status:                 LeadStatus
  source:                 string
  fingerprint_id:         string | null
  visitor_fingerprint_id: string | null
  ip_address:             string | null
  country_code:           string | null
  city:                   string | null
  browser:                string | null
  device_type:            string | null
  visit_count:            number
  last_seen_at:           string
  notes:                  string | null
  created_at:             string
}

export interface Visitor {
  id:               string
  fingerprint_id:   string
  ip_address:       string | null
  country_code:     string | null
  city:             string | null
  browser:          string | null
  device_type:      string | null
  referrer:         string | null
  utm_source:       string | null
  utm_medium:       string | null
  utm_campaign:     string | null
  visit_count:      number
  page_views:       number
  first_seen_at:    string
  last_seen_at:     string
  demo_page_viewed: boolean
  form_submitted:   boolean
}

export interface VisitorEvent {
  id:             string
  fingerprint_id: string
  event_type:     EventType
  page:           string | null
  element:        string | null
  metadata:       Record<string, unknown>
  created_at:     string
}

export interface Database {
  public: {
    Tables: {
      tenants:        { Row: Tenant;       Insert: Omit<Tenant,       'id' | 'created_at'>;                    Update: Partial<Tenant>       }
      licenses:       { Row: License;      Insert: Omit<License,      'id' | 'created_at' | 'updated_at'>;     Update: Partial<License>      }
      leads:          { Row: Lead;         Insert: Omit<Lead,         'id' | 'created_at'>;                    Update: Partial<Lead>         }
      visitors:       { Row: Visitor;      Insert: Omit<Visitor,      'id' | 'first_seen_at' | 'last_seen_at'>; Update: Partial<Visitor>     }
      visitor_events: { Row: VisitorEvent; Insert: Omit<VisitorEvent, 'id' | 'created_at'>;                    Update: Partial<VisitorEvent> }
    }
  }
}
