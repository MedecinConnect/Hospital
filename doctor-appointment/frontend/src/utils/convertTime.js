// convertTime.js
const convertTime = time => {
  if (!time) {
    return "Invalid time"; // Ou tout autre message par défaut
  }

  const timeParts = time.split(":");
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  let meridiem = "am";
  if (hours >= 12) {
    meridiem = "pm";
    if (hours > 12) {
      hours -= 12;
    }
  }

  return (
    hours.toString().padStart(2) +
    ":" +
    minutes.toString().padStart(2, "0") +
    " " +
    meridiem
  );
};

export default convertTime;
