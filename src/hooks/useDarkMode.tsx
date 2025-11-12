import { useEffect, useState } from "react";

export default function useDarkMode(): [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
] {
    const [darkMode, setDarkMode] = useState(() => {
        const theme = localStorage.getItem("theme");
        return theme === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document
            .querySelector("html")
            ?.classList.toggle("light-mode", !darkMode);
    }, [darkMode]);

    return [darkMode, setDarkMode];
}
