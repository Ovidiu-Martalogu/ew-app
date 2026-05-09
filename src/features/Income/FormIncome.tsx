
type Props = {
    addIncomeToDB: (e: React.SubmitEvent<HTMLFormElement>) => void;
    type: "active" | "passive";
    setType: React.Dispatch<React.SetStateAction<"active" | "passive">>;
    errors: Record<string, string>;
    insertdetails: string;
    setInsertDetails: React.Dispatch<React.SetStateAction<string>>;
    submitError: string;
    styles: any;
};

export const IncomeForm = ({
    addIncomeToDB,
    type,
    setType,
    errors,
    insertdetails,
    setInsertDetails,
    submitError,
    styles,
}: Props) => {
    return (
        <form onSubmit={addIncomeToDB} className={styles.formAddIncome}>
            <div className={styles.formGroup}>
                <label htmlFor="type"> Type:</label>
                <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value as "active" | "passive")
                    }
                >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                </select>
                {errors.type && <p>{errors.type}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="date"> Date: </label>
                <input
                    id="date"
                    type="date"
                    name="date"
                    className={styles.input}
                />
                {errors.date && <p className={styles.error}>{errors.date || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="amount">Amount:</label>
                <input
                    id="amount"
                    type="number"
                    name="amount"
                    className={styles.input}
                />
                {errors.amount && <p className={styles.error}>{errors.amount || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category">Category:</label>
                <input
                    id="category"
                    type="text"
                    name="category"
                    className={styles.input}
                />
                {errors.category && <p className={styles.error}>{errors.category || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="details">Details:</label>
                <textarea
                    id="details"

                    name="details"
                    value={insertdetails}
                    onChange={(e) => setInsertDetails(e.target.value)}
                    className={styles.input}

                />
                {errors.details && <p className={styles.error}>{errors.details || ""}</p>}
            </div>

            <button type="submit" className={styles.addIncomeButton}>
                Add Income
            </button>

            {submitError && <p className={styles.error}>{submitError}</p>}
        </form>
    );
};

