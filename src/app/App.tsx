import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { RentalProvider } from "./context/RentalContext";

export default function App() {
  return (
    <RentalProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </RentalProvider>
  );
}