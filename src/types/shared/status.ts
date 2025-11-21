export type FirestoreTimestampJson = {
    _seconds: number;
    _nanoseconds: number;
  };

export type ApiStatusDoc = {
  status: string;
  message?: string;
  updatedAt?: string | FirestoreTimestampJson;
  createdAt?: string | FirestoreTimestampJson;
};

  export type CarStatus = {
    status: "complete" | "in progress" | "missing" | "unknown";
    message?: string;
    lastChecked?: string | null; // ISO string; UI will localize
  };
