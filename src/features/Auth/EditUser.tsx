import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FirstPage } from "../First-page/FirstPage";

import styles from "../../features/Auth/context/EditUser.module.css"

const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

const apiUrlLogin = `${import.meta.env.VITE_API_URL}/login`;

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export function EditUser() {
    const [user, setUser] = useState<User | null>(null);
    
    
    const userId = localStorage.getItem("auth");
    
    
    useEffect(() => {
                
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Id este: ${data.user}`);
            setUser(data.user);
        });
        console.log(userId);
    }, []);



    async function updateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const firstName = form.get("firstName");
        const lastName = form.get("lastName");
        const email = form.get("email");
        const password = form.get("password");


        await fetch(`${apiUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });


    }
    return (
       <>


            <h2>Edit your data</h2>
             {user && (
               
                        <form onSubmit={updateUser} className={styles.brandForm} >
                 
                        <div className={styles.formGroup}>

                            <label htmlFor="firstName">Change First Name</label>

                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder={`Your first name is${user.firstName}`}
                                defaultValue={user.firstName}

                            />
                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="lastName">Change Last Name</label>

                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder={`Your first name is${user.lastName}`}
                                defaultValue={user.lastName}

                            />
                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="email">Change Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                 placeholder={`Your first name is${user.email}`}
                                defaultValue={user.email}

                            />
                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="password">Change Password</label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Set your new password"

                            />
                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="retypepassword">Retype your new Password</label>

                            <input
                                type="password"
                                id="retypepassword"
                                name="retypepassword"
                                placeholder="Retype your new Password"

                            />
                        </div>
                                

                <button type="submit">Change</button>
            </form>
             )}
             <Link to="/" onClick={FirstPage}>
                <strong >Cancel</strong>
            </Link>
            
             
            </>
        )   
}