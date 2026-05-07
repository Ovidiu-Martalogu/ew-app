
export function getAuth() {
    try {
        const authRaw = localStorage.getItem("auth");
        if (!authRaw) return null;

        return JSON.parse(authRaw);
    } catch (error) {
        console.error("Invalid auth in localStorage:", error);
        return null;
    }
}