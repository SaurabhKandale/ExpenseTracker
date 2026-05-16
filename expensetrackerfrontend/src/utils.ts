export const convertFirstLetterToCapital = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatToRupees = (amount: number) =>
  `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const mergeDateAndTimeToIST = (
  dateString: string,
  timeString: string
) => {
  // Parse the input date and time
  const [year, month, day] = dateString.split("-"); // Extract year, month, day
  const [hours, minutes] = timeString.split(":"); // Extract hours and minutes

  // Combine into a raw IST date-time string
  const rawIST = `${year}-${month}-${day}T${hours}:${minutes}:00`;

  return rawIST;
};

export const formatToCustomDateIST = (date: Date) => {
  const istDate = new Date(date.getTime());
  const day = istDate.getDate().toString().padStart(2, "0"); // Add leading zero
  const month = istDate.toLocaleString("en-IN", { month: "short" }); // Get short month name
  const year = istDate.getFullYear(); // Get year
  return `${day} ${month}, ${year}`;
};

export const convertToDateFormat = (dateString: string) => {
  const [day, month, year] = dateString.split("/"); // Split the input string into day, month, and year
  return `${year}-${day.padStart(2, "0")}-${month.padStart(2, "0")}`; // Format as yyyy-mm-dd
};

export const getTimeFromDate = (dateString: string) => {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

/** 24-hour HH:mm for <input type="time"> */
export const getTimeInputValueFromDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getDayFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getDay();
};

export function convertMMMMto(monthYearString: string) {
  const [monthName, year] = monthYearString.split(', ');
  const date = new Date(parseInt(year), new Date(Date.parse(monthName + " 1, " + year)).getMonth()+1, 1);
  return date.toISOString().slice(0, 10);
}

export const convertDateInISOtoIST = (dateString: Date) => {
  return new Date(dateString.getTime() + 330 * 60000).toISOString();

}

