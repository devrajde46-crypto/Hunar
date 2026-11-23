/**
 * TypeScript domain and API types for Hunar.
 * Derived from docs/openapi.yml and Phase 2 backend models.
 */

export type RoleEnum = 'LEARNER' | 'TRAINER' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN';

export type DifficultyEnum = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface InstitutionSummary {
  id: string;
  name: string;
  code: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: RoleEnum;
  first_name: string;
  last_name: string;
  phone_number: string;
  trainee_id_number: string;
  institution: InstitutionSummary;
  is_active: boolean;
  date_joined: string;
}

export interface Trade {
  id: string;
  name: string;
  code: string;
  description: string;
  institution: string;
  is_active: boolean;
  created_at: string;
}

export interface Module {
  id: string;
  trade: string;
  title: string;
  sequence_order: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface ProcedureStep {
  id: string;
  procedure: string;
  step_number: number;
  step_code: string;
  title: string;
  description: string;
  expected_tool: string;
  visual_evidence_cue: string;
  is_safety_critical: boolean;
  common_mistakes: string;
  hold_duration_seconds: number;
  is_active: boolean;
  created_at: string;
}

export interface Procedure {
  id: string;
  procedure_code: string;
  title: string;
  module: string;
  difficulty: DifficultyEnum;
  estimated_duration_minutes: number;
  description: string;
  safety_instructions: string;
  required_tools: string[];
  is_active: boolean;
  steps?: ProcedureStep[];
  total_steps?: number;
  safety_critical_steps_count?: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RegisterConsent {
  consent_version: string;
  is_granted: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  trainee_id_number?: string;
  institution_code: string;
  consent: RegisterConsent;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface ApiErrorResponse {
  detail?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  [key: string]: unknown;
}
