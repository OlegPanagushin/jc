const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+([.]?[a-zA-Z0-9_])*$/;
const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+([ ]?[a-zA-Z0-9])*$/;

export function validateEmail(value) {
  if (!value) return "Email is required field";
  if (!value.match(EMAIL_REGEX)) return "Doesn't look like email";
}

export function validateFirstName(value) {
  if (!value) return "'First Name' is required field";
  if (value.length < 2) return "'First Name' is too short";
  if (value.startsWith(" ") || value.endsWith(" "))
    return "'space' cannot be the first or the last character";
  if (!value.match(FIRSTNAME_REGEX))
    return "'First Name' may consist only of numbers, Latin letters and spaces";
}

export function validateUsername(value) {
  if (!value) return "Username is required required";
  if (value.length < 2) return "Username is too short";
  if (value.startsWith(".") || value.endsWith("."))
    return "'dot' cannot be the first or the last character";
  if (!value.match(USERNAME_REGEX))
    return "Username may consist only of number, Latin letters, dots and underscores";
}
