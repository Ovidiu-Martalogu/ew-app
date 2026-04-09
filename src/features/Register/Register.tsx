import { useState } from "react";
import { useZodValidation } from "../hooks/useZodValidation";
import { Navigate } from "react-router";
import { Api } from "../utils/api";
import { useAuth } from "../../context/useAuth";
import * as z from "zod";
import styles from "./Register.module.css"




// const registerApi = `${import.meta.env.VITE_API_URL}/register`;
const registerApi = new Api("register");

const validationSchema = z
    .object({
        email: z.email("Please provide a valid email address."),
        password: z
            .string()
            .min(6, "Your password needs to be at least 6 characters long."),
        retypePassword: z.string().min(6, "Please type your password again."),
        firstName: z.string().nonempty("Please tell us how to call you."),
        lastName: z.string().nonempty("Let us know your last name."),
    })
    .refine((data) => data.password === data.retypePassword, {
        message: "Passwords don't match.",
        path: ["retypePassword"],
    });

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

        // void registerApi.create(dataForServer).then((res) => console.log(res));
        void registerApi.create(dataForServer).then((res) => {
    login(res); 
});
    }

    // function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {


    //     if (errors) {
    //         isValid(formValues);
    //     }

    //     setFormValues({ ...formValues, [e.target.name]: e.target.value });
    // }
    
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedValues = {
            ...formValues,
            [e.target.name]: e.target.value
        };
        
        setFormValues(updatedValues);
        
        isValid(updatedValues); // validezi NOILE valori
    }
    
    if (user) {
        return <Navigate to="/" />
    }


    return (
        <div className={styles.container}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>

                <div className={styles['form-group']}>
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

                    <button className={styles.button} type="submit">Register</button>
                </div>
            </form>
        </div>

    );
}
