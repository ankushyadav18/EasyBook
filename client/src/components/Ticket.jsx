import { ticketDateFormat } from "../lib/ticketDateFormat";
import timeFormat from "../lib/timeFormat";
import isoTimeFormat from "../lib/isoTimeFormat";
import logo from "../assets/logo.png";
import React, { forwardRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import Barcode from "react-barcode";

const Ticket = forwardRef(({ booking }, ref) => {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const qrData = `
Movie: ${booking.movie.title}
Date: ${ticketDateFormat(booking.show.showDate)}
Time: ${isoTimeFormat(booking.show.showTime)}
Seats: ${booking.seats.join(", ")}
Booking ID: ${booking._id}
`;

      const url = await QRCode.toDataURL(qrData, {
        width: 500,
        margin: 2,
        color: {
          dark: "#111827",
          light: "#FFFFFF",
        },
      });

      setQrCode(url);
    };

    generateQR();
  }, [booking]);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[900px] overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#111827] via-[#161b29] to-[#0f172a] text-white shadow-[0_25px_80px_rgba(239,68,68,0.35)] sm:rounded-[32px]"
    >
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-red-600/20 blur-[100px] sm:h-72 sm:w-72 sm:blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-red-500/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[120px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          src={logo}
          alt="Easybook"
          className="w-64 rotate-[-25deg] select-none opacity-[0.035] sm:w-[420px]"
        />
      </div>

      <div className="relative flex flex-col gap-4 bg-gradient-to-r from-[#324a5f] to-red-500 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg sm:h-14 sm:w-14">
            <img
              src={logo}
              alt="EasyBook"
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-2xl font-black tracking-wider sm:text-3xl">
              EASYBOOK
            </h1>
            <p className="text-sm text-red-100 sm:text-base">
              Premium Movie Ticket
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div
            className={`rounded-full px-4 py-2 text-xs font-bold tracking-wider sm:px-6 sm:text-sm ${
              booking.paymentStatus === "paid"
                ? "bg-green-500 text-black"
                : "bg-yellow-400 text-black"
            }`}
          >
            {booking.paymentStatus === "paid" ? "PAID" : "PENDING"}
          </div>

          <span className="rounded-full border border-green-400/30 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
            ✓ VERIFIED TICKET
          </span>
        </div>
      </div>

      <div className="absolute left-0 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black sm:block" />
      <div className="absolute right-0 top-1/2 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 rounded-full bg-black sm:block" />

      <div className="relative flex flex-col gap-6 p-4 sm:p-8 lg:flex-row lg:gap-8">
        <div className="relative mx-auto w-full max-w-[220px] shrink-0 sm:max-w-[260px] lg:mx-0 lg:w-52">
          <div className="absolute -inset-3 rounded-3xl bg-red-500/20 blur-2xl" />
          <img
            src={booking.movie.poster_path}
            alt={booking.movie.title}
            className="relative h-auto w-full rounded-2xl border border-white/10 object-cover shadow-2xl sm:rounded-3xl lg:h-[310px]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h2 className="break-words text-2xl font-black leading-tight sm:text-4xl">
              {booking.movie.title}
            </h2>

            <p className="mt-3 text-sm italic text-gray-400 sm:text-base">
              "Experience cinema like never before."
            </p>

            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              <div className="rounded-full bg-white/10 px-3 py-2 text-sm sm:px-4">
                ⭐ {Number(booking.movie.vote_average || 0).toFixed(1)}
              </div>

              <div className="rounded-full bg-white/10 px-3 py-2 text-sm sm:px-4">
                {timeFormat(booking.movie.runtime)}
              </div>

              {booking.movie.genres?.slice(0, 2).map((genre) => (
                <div
                  key={genre.id || genre.name}
                  className="rounded-full bg-white/10 px-3 py-2 text-sm sm:px-4"
                >
                  {genre.name}
                </div>
              ))}

              <div className="rounded-full bg-white/10 px-3 py-2 text-sm uppercase sm:px-4">
                {booking.movie.original_language}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="min-w-0">
                <p className="text-sm text-gray-500">THEATRE</p>
                <h3 className="mt-1 break-words text-lg font-semibold sm:text-xl">
                  {booking.show.theatreName}
                </h3>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">SCREEN</p>
                <h3 className="mt-1 break-words text-lg font-semibold sm:text-xl">
                  {booking.show.screen}
                </h3>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">DATE</p>
                <h3 className="mt-1 break-words text-lg font-semibold sm:text-xl">
                  {ticketDateFormat(booking.show.showDate)}
                </h3>
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">TIME</p>
                <h3 className="mt-1 break-words text-lg font-semibold sm:text-xl">
                  {isoTimeFormat(booking.show.showTime)}
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-3 text-gray-500">Seats</p>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {booking.seats.map((seat) => (
                  <div
                    key={seat}
                    className="rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-4 py-2 text-sm font-bold tracking-wider shadow-lg shadow-red-600/30 sm:px-5"
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="text-sm text-gray-400">Amount Paid</p>

              <h1 className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                ₹{booking.totalAmount}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="relative my-2">
        <div className="absolute -left-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black sm:block" />
        <div className="absolute -right-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black sm:block" />
        <div className="border-t-2 border-dashed border-white/15" />
      </div>

      <div className="flex flex-col bg-black/30 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6 px-4 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 sm:tracking-[0.3em]">
                  Booking ID
                </p>

                <h3 className="mt-2 break-all font-mono text-base sm:text-lg">
                  EB-{booking._id.slice(-8).toUpperCase()}
                </h3>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 sm:tracking-[0.3em]">
                  Tickets
                </p>

                <h3 className="text-lg font-semibold">
                  {booking.seats.length}
                </h3>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 sm:tracking-[0.3em]">
                Ticket Holder
              </p>

              <h3 className="mt-2 break-words text-lg font-semibold">
                {booking.user?.name || "EasyBook Customer"}
              </h3>
            </div>
          </div>

          <div className="max-w-sm text-left lg:text-center">
            <h2 className="text-xl font-black tracking-widest text-red-500 sm:text-2xl">
              EASYBOOK
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Premium Digital Movie Ticket
            </p>

            <p className="mt-6 text-xs text-gray-500">
              Please carry a valid ID proof along with this ticket. Scan the QR
              code at the theatre entrance.
            </p>

            <p className="mt-4 text-xs text-gray-500">
              Please arrive 20 minutes before the show starts.
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Outside food & beverages are not allowed.
            </p>
          </div>
        </div>

        <div className="flex border-t border-dashed border-white/20 bg-black/40 p-5 lg:w-52 lg:flex-col lg:items-center lg:justify-center lg:border-l lg:border-t-0">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-4 lg:flex-col">
            <div className="rounded-2xl bg-white p-2">
              <img src={qrCode} alt="QR Code" className="h-24 w-24" />
            </div>

            <div className="max-w-full overflow-hidden rounded-lg bg-white p-1">
              <Barcode
                value={`EB-${booking._id.slice(-8).toUpperCase()}`}
                height={28}
                width={1}
                displayValue={false}
              />
            </div>

            <p className="hidden text-[10px] tracking-[0.4em] text-gray-400 lg:block lg:rotate-90">
              EASYBOOK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Ticket;
