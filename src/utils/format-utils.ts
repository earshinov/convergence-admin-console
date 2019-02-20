import moment from "moment";

export function shortDateTime(time: Date | number): string {
  return moment(time).format("MM/DD @ hh:mma")
}

export function longDateTime(time: Date | number): string {
  return moment(time).format("MM/DD/YYYY @ hh:mma")
}

export function longDateTimeWithSeconds(time: Date | number): string {
  return moment(time).format("MM/DD/YYYY @ hh:mm:ssa")
}

export function truncate(str: string, maxLen: number): string {
  if (str.length + 3 > maxLen) {
    return str.substring(0, maxLen - 3) + "...";
  } else {
    return str;
  }
}