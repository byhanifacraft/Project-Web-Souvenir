export interface WorkshopTakeHomeItem {
  id?: string;
  title: string;
  image_url?: string;
  description?: string;
}

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
  takeHome: (string | WorkshopTakeHomeItem)[];
  buttonLabel: string;
  waMessage: string;
}

export function normalizeTakeHomeItem(item: string | WorkshopTakeHomeItem): WorkshopTakeHomeItem {
  if (typeof item === 'string') {
    return { title: item };
  }
  return item;
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
