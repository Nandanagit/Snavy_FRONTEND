// app/layout.tsx
import "../../styles/global.css";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: "Video Generator",
  description: "Turn any website's images into a promotional video",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
        <ToastContainer position="top-right" autoClose={5000} />
      </body>
    </html>
  );
}
