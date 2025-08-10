export function startOfMonth(date: Date) {
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  }
  
  export function endOfMonth(date: Date) {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
  }
  
  export function startOfWeek(date: Date) {
    const d = new Date(date)
    const day = d.getDay() // 0 Sun
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  
  export function endOfWeek(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() + (6 - day))
    d.setHours(23, 59, 59, 999)
    return d
  }
  
  export function addMonths(date: Date, count: number) {
    const d = new Date(date)
    const day = d.getDate()
    d.setMonth(d.getMonth() + count)
    // handle month overflow
    if (d.getDate() < day) d.setDate(0)
    return d
  }
  
  export function isSameMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  }
  
  export function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }
  
  export function isBefore(a: Date, b: Date) {
    return a.getTime() < b.getTime()
  }
  
  export function isAfter(a: Date, b: Date) {
    return a.getTime() > b.getTime()
  }
  
  export function parseISO(iso: string) {
    return new Date(iso)
  }
  
  export function format(date: Date, fmt: string) {
    // minimal formatter for patterns used in this project
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
    return fmt
      .replace("MMMM", MONTHS[date.getMonth()])
      .replace("yyyy", String(date.getFullYear()))
      .replace("PP", `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`)
      .replace("PPP", `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`)
  }
  
  export function isToday(date: Date) {
    const today = new Date()
    return isSameDay(date, today)
  }
  