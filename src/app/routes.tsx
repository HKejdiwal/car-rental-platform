import { createBrowserRouter } from "react-router";
import { CustomerPage } from "./components/CustomerPage";
import { SellerPage } from "./components/SellerPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: CustomerPage },
      { path: "seller", Component: SellerPage },
    ],
  },
]);
