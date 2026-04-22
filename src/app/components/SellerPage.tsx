import { useState } from "react";
import { Calendar, DollarSign, AlertCircle, Check, X, Clock, User, Phone, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useRental } from "../context/RentalContext";

export function SellerPage() {
  const { requests, updateRequestStatus, updateReturnDate } = useRental();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    updateRequestStatus(id, "approved");
    toast.success("Rental request approved!");
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, "rejected");
    toast.error("Rental request rejected");
    setSelectedRequest(null);
  };

  const handleMarkReturned = (id: string, actualReturnDate: string) => {
    updateReturnDate(id, actualReturnDate);
    toast.success("Car marked as returned");
  };

  const calculateLateFee = (request: RentalRequest) => {
    if (!request.actualReturnDate || !request.returnDate) return 0;

    const expected = new Date(request.returnDate);
    const actual = new Date(request.actualReturnDate);
    const diffTime = actual.getTime() - expected.getTime();
    const lateDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return lateDays * request.bidPrice * 0.5;
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const activeRentals = requests.filter((r) => r.status === "approved");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage rental requests and track active rentals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Rentals</p>
              <p className="text-3xl font-bold text-gray-900">{activeRentals.length}</p>
            </div>
            <Check className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{activeRentals.reduce((sum, r) => sum + r.bidPrice * calculateDuration(r.startDate, r.endDate), 0).toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((request) => {
                const duration = calculateDuration(request.startDate, request.endDate);
                const total = request.bidPrice * duration;
                const priceDiff = request.bidPrice - request.suggestedPrice;

                const expanded = selectedRequest === request.id;

                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{request.carName}</h3>
                        <p className="text-sm text-gray-600">{request.customerName}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(expanded ? null : request.id)}
                      className="w-full text-left mb-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {expanded ? "Hide" : "View"} Customer Details
                    </button>

                    {expanded && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{request.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{request.phoneNumber}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-gray-900 flex-1">{request.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Aadhaar:</span>
                          <span className="font-medium text-gray-900">{request.aadhaarNumber}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-900">{request.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="font-medium text-gray-900">{request.endDate}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Customer Bid</span>
                        <span className="font-medium">₹{request.bidPrice.toLocaleString('en-IN')}/day</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Your Price</span>
                        <span className="font-medium">₹{request.suggestedPrice.toLocaleString('en-IN')}/day</span>
                      </div>
                      {priceDiff !== 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            {priceDiff > 0 ? `₹${priceDiff.toLocaleString('en-IN')} above` : `₹${Math.abs(priceDiff).toLocaleString('en-IN')} below`} your price
                          </span>
                        </div>
                      )}
                      <div className="border-t mt-2 pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Total ({duration} days)</span>
                          <span className="font-bold text-blue-600">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Rentals & Late Fees</h2>
          <div className="space-y-4">
            {activeRentals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Check className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No active rentals</p>
              </div>
            ) : (
              activeRentals.map((request) => {
                const duration = calculateDuration(request.startDate, request.endDate);
                const total = request.bidPrice * duration;
                const lateFee = calculateLateFee(request);
                const isLate = lateFee > 0;
                const today = new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={request.id}
                    className={`bg-white rounded-xl shadow-sm p-5 border-2 ${
                      isLate ? "border-red-300" : "border-green-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{request.carName}</h3>
                        <p className="text-sm text-gray-600">{request.customerName}</p>
                        <p className="text-xs text-gray-500">{request.phoneNumber}</p>
                      </div>
                      <span
                        className={`px-3 py-1 ${
                          isLate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        } text-xs font-medium rounded-full`}
                      >
                        {isLate ? "Late Return" : "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-500">Rental Period</p>
                        <p className="font-medium text-gray-900">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expected Return</p>
                        <p className="font-medium text-gray-900">{request.returnDate}</p>
                      </div>
                    </div>

                    {!request.actualReturnDate && (
                      <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Mark as Returned</label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            defaultValue={today}
                            id={`return-date-${request.id}`}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`return-date-${request.id}`) as HTMLInputElement;
                              if (input.value) {
                                handleMarkReturned(request.id, input.value);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}

                    {request.actualReturnDate && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Actual Return Date</p>
                        <p className="font-medium text-gray-900">{request.actualReturnDate}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Rental Total</span>
                        <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      {isLate && (
                        <>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              Late Fee (50%/day)
                            </span>
                            <span className="font-medium text-red-600">₹{lateFee.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t mt-2 pt-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-900">Total with Fee</span>
                              <span className="font-bold text-red-600">₹{(total + lateFee).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
