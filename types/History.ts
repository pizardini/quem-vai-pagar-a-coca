export interface History {

    id: string;

    date: string;

    participantName: string;

    participantType: "fixed" | "sporadic";

    result: "paid" | "not-paid";

}