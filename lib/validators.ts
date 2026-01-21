export const currentYear = new Date().getFullYear();

export type RegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  yearOfJoining: string;
  yearOfLeaving: string;
  classOfJoining: string;
  lastClassStudied: string;
  lastHouse: string;
  addressFull: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
};

export const sanitize = (value: string) => value.trim();

export const validateRegistration = (payload: RegistrationPayload) => {
  const errors: string[] = [];
  const requiredFields: (keyof RegistrationPayload)[] = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "yearOfJoining",
    "yearOfLeaving",
    "classOfJoining",
    "lastClassStudied",
    "lastHouse",
    "addressFull",
    "city",
    "pincode",
    "state",
    "country",
  ];

  requiredFields.forEach((field) => {
    if (!payload[field] || !payload[field].trim()) {
      errors.push(`${field} is required`);
    }
  });

  const mobileDigits = payload.mobile.replace(/\D/g, "");
  if (mobileDigits.length !== 10) {
    errors.push("Mobile number must be 10 digits");
  }

  const joinYear = Number(payload.yearOfJoining);
  const leaveYear = Number(payload.yearOfLeaving);

  if (joinYear < 1900 || joinYear > currentYear) {
    errors.push("Year of joining must be between 1900 and current year");
  }

  if (leaveYear < 1900 || leaveYear > currentYear) {
    errors.push("Year of leaving must be between 1900 and current year");
  }

  if (leaveYear < joinYear) {
    errors.push("Year of leaving must be after year of joining");
  }

  return errors;
};
