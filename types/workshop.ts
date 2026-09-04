export interface WorkshopPackage {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  price: string;
  duration: string;
  capacity: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  takeHome: string[];
  buttonLabel: string;
  waMessage: string;
}

export interface CurriculumStep {
  step: string;
  title: string;
  desc: string;
}

export interface ReservationStep {
  step: string;
  title: string;
  desc: string;
}
