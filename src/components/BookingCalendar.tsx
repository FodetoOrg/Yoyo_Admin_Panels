"use client"

import { useMemo, useState } from "react"
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "@/lib/utils/date-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye, CalendarIcon } from "lucide-react"

type Booking = {
  id: string
  guestName: string
  guestEmail?: string
  guestPhone?: string
  status: string
  paymentStatus?: string
  paymentMode?: string
  totalAmount?: number
  checkInDate: string
  checkOutDate: string
}

function toDate(value: string | Date) {
  return value instanceof Date ? value : parseISO(value)
}

function isDateInRange(day: Date, start: Date, end: Date) {
  // treat checkout as exclusive
  const last = new Date(end)
  // subtract 1 millisecond so the end day isn't counted when same day
  last.setMilliseconds(last.getMilliseconds() - 1)
  return (isAfter(day, start) || isSameDay(day, start)) && (isBefore(day, last) || isSameDay(day, last))
}

function statusColor(status: string): string {
  const s = (status ?? "").toLowerCase()
  if (["confirmed", "completed", "processed", "active", "available", "occupied", "success"].includes(s))
    return "bg-emerald-500"
  if (["pending"].includes(s)) return "bg-amber-500"
  if (["cancelled", "rejected", "failed"].includes(s)) return "bg-rose-500"
  return "bg-slate-400"
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function BookingCalendar({
  bookings,
  initialMonth,
  className,
  title = "Availability Calendar",
}: {
  bookings: Booking[]
  initialMonth?: Date
  className?: string
  title?: string
}) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialMonth ?? new Date()))
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthMatrix = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    const days: Date[] = []
    const d = new Date(start)
    while (d <= end) {
      days.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    const weeks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }
    return weeks
  }, [currentMonth])

  const bookingsByDay = useMemo(() => {
    // map YYYY-MM-DD -> bookings[]
    const map = new Map<string, Booking[]>()
    const keyFor = (d: Date) => d.toISOString().slice(0, 10)
    const add = (day: Date, booking: Booking) => {
      const k = keyFor(day)
      const arr = map.get(k) ?? []
      arr.push(booking)
      map.set(k, arr)
    }
    bookings.forEach((b) => {
      const start = toDate(b.checkInDate)
      const end = toDate(b.checkOutDate)
      // iterate each day in range
      const iter = new Date(start)
      while (iter < end) {
        add(iter, b)
        iter.setDate(iter.getDate() + 1)
      }
    })
    return map
  }, [bookings])

  const openDayDetails = (day: Date) => {
    setSelectedDay(day)
    setOpen(true)
  }

  const selectedKey = selectedDay ? selectedDay.toISOString().slice(0, 10) : ""
  const dayBookings = selectedDay ? (bookingsByDay.get(selectedKey) ?? []) : []

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="inline-flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
            Today
          </Button>
          <div className="flex items-center gap-1 rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Confirmed
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Pending
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Cancelled
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="px-1 text-center text-xs font-medium text-muted-foreground">
              {w}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthMatrix.flat().map((day) => {
            const key = day.toISOString().slice(0, 10)
            const dayList = bookingsByDay.get(key) ?? []
            const inMonth = isSameMonth(day, currentMonth)
            const hasBookings = dayList.length > 0

            return (
              <button
                key={key}
                type="button"
                onClick={() => hasBookings && openDayDetails(day)}
                className={[
                  "relative flex h-20 flex-col rounded-md border p-1 text-left transition-colors sm:h-24",
                  inMonth ? "bg-white" : "bg-muted/30",
                  hasBookings ? "ring-1 ring-amber-300 hover:bg-amber-50" : "hover:bg-accent/50",
                ].join(" ")}
                aria-label={`Day ${format(day, "PPP")}${hasBookings ? `, ${dayList.length} booking(s)` : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={["text-xs", inMonth ? "text-foreground" : "text-muted-foreground/60"].join(" ")}>
                    {day.getDate()}
                  </span>
                  {isToday(day) ? <Badge className="h-5 px-1.5 text-[10px]">Today</Badge> : null}
                </div>

                {/* Booking dots */}
                <div className="absolute bottom-1 left-1 right-1 flex flex-wrap items-center gap-1">
                  {dayList.slice(0, 3).map((b) => (
                    <span
                      key={b.id}
                      className={["h-2 w-2 rounded-full", statusColor(b.status)].join(" ")}
                      title={`${b.guestName} (${b.status})`}
                    />
                  ))}
                  {dayList.length > 3 ? (
                    <span className="text-[10px] text-muted-foreground">+{dayList.length - 3}</span>
                  ) : null}
                </div>

                {/* Background tint for booked days */}
                {hasBookings ? (
                  <div className="pointer-events-none absolute inset-0 rounded-md bg-amber-50/40" />
                ) : null}
              </button>
            )
          })}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bookings on {selectedDay ? format(selectedDay, "PPP") : ""}</DialogTitle>
            <DialogDescription>Tap a booking to view more details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {!dayBookings.length ? (
              <div className="text-sm text-muted-foreground">No bookings for this day.</div>
            ) : (
              dayBookings.map((b) => (
                <div key={b.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{b.guestName}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(toDate(b.checkInDate), "PP")} → {format(toDate(b.checkOutDate), "PP")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{b.status}</Badge>
                      {b.paymentStatus ? <Badge variant="secondary">{b.paymentStatus}</Badge> : null}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {b.totalAmount !== undefined ? (
                      <div>
                        <span className="font-medium text-foreground">Amount:</span> ₹{b.totalAmount}
                      </div>
                    ) : null}
                    {b.paymentMode ? (
                      <div>
                        <span className="font-medium text-foreground">Mode:</span> {b.paymentMode}
                      </div>
                    ) : null}
                    {b.guestPhone ? <div>Phone: {b.guestPhone}</div> : null}
                    {b.guestEmail ? <div>Email: {b.guestEmail}</div> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`/bookings/${b.id}`}>
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                        <Eye className="h-3 w-3" />
                        View booking
                      </Button>
                    </a>
                    <a href={`/payments?bookingId=${b.id}`}>
                      <Button size="sm" variant="ghost">
                        Payments
                      </Button>
                    </a>
                    <a href={`/refunds?bookingId=${b.id}`}>
                      <Button size="sm" variant="ghost">
                        Refunds
                      </Button>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
