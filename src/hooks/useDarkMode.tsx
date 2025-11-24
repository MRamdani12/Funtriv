import { useEffect, useState } from "react";

export default function useDarkMode(): [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
] {
    // Get the dark mode from the localStorage, darkMode is true if it exists.
    const [darkMode, setDarkMode] = useState(() => {
        const theme = localStorage.getItem("theme");
        return theme === "dark";
    });

    useEffect(() => {
        // Add the class light-mode on the HTML tag if the darkMode state is false
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document
            .querySelector("html")
            ?.classList.toggle("light-mode", !darkMode);
    }, [darkMode]);

    return [darkMode, setDarkMode];
}
