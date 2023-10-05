export const isEmailValid = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const isPasswordValid = (password) => {
  if (password.length < 8 || password.length > 30) {
    return false;
  }

  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;

  return (
    lowercaseRegex.test(password) &&
    uppercaseRegex.test(password) &&
    numberRegex.test(password)
  );
};

export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const isRegistrationValid = (email, password, confirmPassword) => {
  if (!isEmailValid(email)) {
    console.log("email not valid");
    return false;
  } else if (!isPasswordValid(password)) {
    console.log("password not valid");
    return false;
  } else if (!doPasswordsMatch(password, confirmPassword)) {
    console.log("passwords do not mach");
    return false;
  } else {
    console.log("all good");
    return true;
  }
};
