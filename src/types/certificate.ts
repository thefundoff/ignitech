export interface Certificate {
  id: string;
  cert_id: string;
  awardee_name: string;
  tutor_name: string;
  tutor_title: string;
  course_name: string;
  from_date: string;
  to_date: string;
  created_at: string;
}

export interface CertificateFormData {
  awardee_name: string;
  tutor_name: string;
  tutor_title: string;
  course_name: string;
  from_date: string;
  to_date: string;
}
