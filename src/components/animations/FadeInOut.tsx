import { useEffect, useRef, useState } from "react";

type FadeInOutProps = {
    show: boolean;
    firstElement?: boolean;
    children: React.ReactNode;
};

export default function FadeInOut({
    show,
    firstElement = false,
    children,
}: FadeInOutProps) {
    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(show);
    const firstItem = useRef(firstElement);
    useEffect(() => {
        let showTimeout: number;
        let renderTimeout: number;

        if (show) {
            if (firstItem.current) {
                firstItem.current = false;
                showTimeout = setTimeout(() => setVisible(true), 0);
                renderTimeout = setTimeout(() => setShouldRender(true), 0);
            } else {
                showTimeout = setTimeout(() => setVisible(true), 330);
                renderTimeout = setTimeout(() => setShouldRender(true), 300);
            }
        } else {
            showTimeout = setTimeout(() => setVisible(false), 0);
            renderTimeout = setTimeout(() => setShouldRender(false), 300);
        }
        return () => {
            clearTimeout(showTimeout);
            clearTimeout(renderTimeout);
        };
    }, [show]);

    return (
        shouldRender && (
            <div className={`fade ${visible ? "show" : ""}`}>{children}</div>
        )
    );
}
