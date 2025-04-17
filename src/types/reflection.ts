
/**
 * Defines the structure for reflection data submitted by users
 */
export interface ReflectionData {
  wellResponse: string;
  unclearResponse: string;
  shareWithManager: boolean;
  rating?: number;
  feedback?: string;
  category?: string;
  timestamp?: number;
}
