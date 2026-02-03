export interface CongressmanListRow {
  id: string;
  firstName: string;
  lastName: string;
  chamber: "DEPUTY" | "SENATOR";
  termStartDate: string;
  termEndDate: string | null;
  provinceName: string | null;
  blockName: string | null;
  blockColor: string | null;
}

export interface VoteRecordRow {
  id: string;
  billTitle: string;
  voteDate: string | Date;
  voteType: "GENERAL" | "PARTICULAR" | "MOTION";
  choice: "POSITIVE" | "NEGATIVE" | "ABSTENTION" | "ABSENT";
}

export interface LegislativeTermRow {
  id: string;
  chamber: "DEPUTY" | "SENATOR";
  provinceName: string | null;
  startDate: string;
  endDate: string | null;
}

export interface BlockHistoryRow {
  id: string;
  blockName: string;
  blockColor: string;
  startDate: string;
  endDate: string | null;
  leader: boolean | null;
}
