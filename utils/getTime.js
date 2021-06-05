const getMonth = (m) => {
  switch (m) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "July";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
};

const date = () => {
  const date = new Date();
  return `${date.getFullYear()}/${getMonth(
    date.getMonth()
  )}/${date.getDay()} - ${date.toLocaleTimeString()}`;
};

module.exports = date();
