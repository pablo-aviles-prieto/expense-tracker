export interface Categories {
  id: string;
  name: string;
  common?: boolean;
}

export interface EnhancedCategory extends Categories {
  newEntry?: boolean;
}
