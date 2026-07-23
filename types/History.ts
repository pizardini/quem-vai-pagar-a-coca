export interface History {
  id: string;

  date: string;

  participantId: string | null;

  participantName: string;

  participantType: "fixed" | "sporadic" | "none";

  result: "paid" | "not-paid" | "no-coke";
}
