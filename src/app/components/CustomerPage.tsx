import { useState } from "react";
import { Calendar, DollarSign, Users, Fuel, MapPin, Car } from "lucide-react";
import { toast } from "sonner";
import { useRental } from "../context/RentalContext";

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  pricePerDay: number;
  image: string;
  seats: number;
  fuelType: string;
  transmission: string;
  available: boolean;
}

const mockCars: Car[] = [
  {
    id: "1",
    name: "Tesla Model 3",
    brand: "Tesla",
    year: 2024,
    pricePerDay: 7500,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    seats: 5,
    fuelType: "Electric",
    transmission: "Automatic",
    available: true,
  },
  {
    id: "2",
    name: "BMW X5",
    brand: "BMW",
    year: 2023,
    pricePerDay: 10000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    seats: 7,
    fuelType: "Diesel",
    transmission: "Automatic",
    available: true,
  },
  {
    id: "3",
    name: "Mercedes C-Class",
    brand: "Mercedes",
    year: 2024,
    pricePerDay: 8000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    seats: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    available: true,
  },
  {
    id: "4",
    name: "Toyota Camry",
    brand: "Toyota",
    year: 2023,
    pricePerDay: 5500,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    seats: 5,
    fuelType: "Hybrid",
    transmission: "Automatic",
    available: true,
  },
  {
    id: "5",
    name: "Audi A4",
    brand: "Audi",
    year: 2024,
    pricePerDay: 7000,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    seats: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    available: false,
  },
  {
    id: "6",
    name: "Honda CR-V",
    brand: "Honda",
    year: 2023,
    pricePerDay: 6000,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    seats: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    available: true,
  },
];

export function CustomerPage() {
  const { addRequest } = useRental();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleRentalRequest = () => {
    if (!selectedCar || !startDate || !endDate || !bidPrice || !customerName || !phoneNumber || !address || !aadhaarNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (aadhaarNumber.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    const days = calculateDays();
    const totalPrice = parseFloat(bidPrice) * days;

    addRequest({
      carId: selectedCar.id,
      carName: selectedCar.name,
      carPricePerDay: selectedCar.pricePerDay,
      customerName,
      phoneNumber,
      address,
      aadhaarNumber,
      startDate,
      endDate,
      bidPrice: parseFloat(bidPrice),
      suggestedPrice: selectedCar.pricePerDay,
      status: "pending",
      returnDate: endDate,
    });

    toast.success(
      `Rental request submitted for ${selectedCar.name}! Total: ₹${totalPrice.toLocaleString('en-IN')} for ${days} day(s). Waiting for seller approval.`
    );

    setSelectedCar(null);
    setStartDate("");
    setEndDate("");
    setBidPrice("");
    setCustomerName("");
    setPhoneNumber("");
    setAddress("");
    setAadhaarNumber("");
  };

  const days = calculateDays();
  const estimatedTotal = bidPrice ? parseFloat(bidPrice) * days : selectedCar ? selectedCar.pricePerDay * days : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Cars</h1>
        <p className="text-gray-600">Select a car, choose your rental period, and make your price bid</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockCars.map((car) => (
              <div
                key={car.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedCar?.id === car.id
                    ? "border-blue-600 shadow-lg"
                    : car.available
                    ? "border-gray-200 hover:border-blue-300"
                    : "border-gray-200 opacity-60"
                }`}
                onClick={() => car.available && setSelectedCar(car)}
              >
                <div className="relative">
                  <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
                  {!car.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Not Available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{car.brand} • {car.year}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{car.seats}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuelType}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-blue-600 font-bold">
                      <span className="text-xl">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    {selectedCar?.id === car.id && (
                      <span className="text-sm text-blue-600 font-medium">Selected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Request</h2>

            {selectedCar ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Selected Car</p>
                  <p className="font-bold text-gray-900">{selectedCar.name}</p>
                  <p className="text-sm text-gray-500">Suggested: ₹{selectedCar.pricePerDay.toLocaleString('en-IN')}/day</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Card Number *
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="12-digit Aadhaar number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid (per day) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      placeholder={`Suggested: ${selectedCar.pricePerDay.toLocaleString('en-IN')}`}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {days > 0 && bidPrice && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{days} day(s)</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Price per day</span>
                      <span className="font-medium">₹{parseFloat(bidPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Estimated Total</span>
                        <span className="font-bold text-blue-600 text-lg">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRentalRequest}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Rental Request
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a car to start your rental request</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
