



export function EditUser() {


    return (
        <>

            <h2>Edit your data</h2>
            <form className="brandForm" >


                <label htmlFor="firstName">Change First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"

                    onChange={EditUser}
                />


                <label htmlFor="lastName">Change Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"

                    onChange={EditUser}
                />

                <label htmlFor="email">Change Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"

                    onChange={EditUser}
                />


                <label htmlFor="password">Change Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"

                    onChange={EditUser}
                />

                <label htmlFor="retypePassword">Retype Password</label>
                <input
                    type="password"
                    id="retypePassword"
                    name="retypePassword"

                    onChange={EditUser}
                />



                <button type="submit">Change</button>
            </form>

        </>
    )
}