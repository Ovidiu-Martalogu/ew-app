import { useState } from "react";
import { Navigate } from "react-router";
import { useZodValidation } from "../../hooks/useZodValidation";
import { Api } from "../../utils/api";
import { registerSchema as validationSchema } from "./validationSchemas";
import { useAuth } from "./context/useAuth";
import type { Auth } from "./types";

import styles from "../../features/Auth/EditUser.module.css"

const registerApi = new Api("register");


export function Register() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    retypePassword: "",
    firstName: "",
    lastName: "",
  });
  const { errors, isValid } = useZodValidation(validationSchema);

  const { login, user } = useAuth();

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!isValid(formValues)) return;

    const { retypePassword, ...dataForServer } = formValues;

    void registerApi.create<Auth>(dataForServer).then(login);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
   
    const newValues = { ...formValues, [e.target.name]: e.target.value };

    if (errors) {
      isValid(newValues);
    }

    setFormValues(newValues);
  }

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <form className={styles.brandForm} onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={formValues.firstName}
        onChange={handleInputChange}
      />
      {errors?.firstName && <p className="errorMessage">{errors.firstName}</p>}

      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={formValues.lastName}
        onChange={handleInputChange}
      />
      {errors?.lastName && <p className="errorMessage">{errors.lastName}</p>}
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formValues.email}
        onChange={handleInputChange}
      />
      {errors?.email && <p className="errorMessage">{errors.email}</p>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formValues.password}
        onChange={handleInputChange}
      />
      {errors?.password && <p className="errorMessage">{errors.password}</p>}

      <label htmlFor="retypePassword">Retype Password</label>
      <input
        type="password"
        id="retypePassword"
        name="retypePassword"
        value={formValues.retypePassword}
        onChange={handleInputChange}
      />
      {errors?.retypePassword && (
        <p className="errorMessage">{errors.retypePassword}</p>
      )}



      <button type="submit">Register</button>
    </form>
  );
}

