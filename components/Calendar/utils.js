export const isLeapYear = year => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
export const getNumOfDay = (month, year) => [31, 28 + (isLeapYear(year || new Date().getFullYear()) ? 1 : 0 ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
export const getWeekDayFullName = day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
export const getWeekDayShortNameList = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const getWeekDayShortName = day => getWeekDayShortNameList(day);
export const getMonthFullName = month => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
export const getMonthShortName = month => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
export const getFirstWeekdayOfMonth = (month, year) => new Date(year || new Date().getFullYear(), month, 1).getDay();
export const getLastWeekdayOfMonth = (month, year) => ( getFirstWeekdayOfMonth(month, year) + getNumOfDay(month, year) % 7 ) % 7;
