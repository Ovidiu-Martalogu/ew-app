


export function getAuth() {
    try {
        const authRaw = localStorage.getItem("auth");
        if (!authRaw) return null;

        const result = JSON.parse(authRaw);

        return result?.user?.id ?? null;
    } catch (error) {
        console.error("Invalid auth in localStorage:", error);
        return null;
    }
}