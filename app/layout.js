import localFont from "next/font/local";
import "./globals.css";
import React from 'react';
import Footer from './Components/footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Dish Dash",
  description: "Platform to help peopel cook together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="content">
          {children}
        </div>
        <Footer /> 
      </body>
    </html>
  );
}
