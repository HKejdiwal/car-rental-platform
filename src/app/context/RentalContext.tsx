import { createContext, useContext, useState, ReactNode } from "react";

export interface RentalRequest {
  id: string;
  carId: string;
  carName: string;
  carPricePerDay: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  aadhaarNumber: string;
  startDate: string;
  endDate: string;
  bidPrice: number;
  suggestedPrice: number;
  status: "pending" | "approved" | "rejected";
  returnDate?: string;
  actualReturnDate?: string;
  submittedAt: string;
}

interface RentalContextType {
  requests: RentalRequest[];
  addRequest: (request: Omit<RentalRequest, "id" | "submittedAt">) => void;
  updateRequestStatus: (id: string, status: "approved" | "rejected") => void;
  updateReturnDate: (id: string, actualReturnDate: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RentalRequest[]>([]);

  const addRequest = (request: Omit<RentalRequest, "id" | "submittedAt">) => {
    const newRequest: RentalRequest = {
      ...request,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  const updateRequestStatus = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const updateReturnDate = (id: string, actualReturnDate: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, actualReturnDate } : req))
    );
  };

  return (
    <RentalContext.Provider
      value={{ requests, addRequest, updateRequestStatus, updateReturnDate }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error("useRental must be used within RentalProvider");
  }
  return context;
}
