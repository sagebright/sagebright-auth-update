
export interface Question {
  id: number;
  text: string;
  type: "icebreaker" | "reflective" | "team";
  frequency: string;
  nextDelivery: string;
  active: boolean;
}

export interface TimelineDay {
  date: string;
  displayDate: string;
  questions: Question[];
}
