type BlockType = {
    bgColor?: string;
    className?: string;
};

export default function Block({ bgColor, className }: BlockType) {
    return (
        <svg
            width="45"
            height="45"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className ? className : ""}
        >
            <rect
                x="5"
                width="34.9995"
                height="4.99997"
                fill={bgColor ? bgColor : "currentColor"}
            />
            <rect
                x="5.61279"
                y="40"
                width="34.9995"
                height="4.99997"
                fill={bgColor ? bgColor : "currentColor"}
            />
            <rect
                x="40"
                y="40"
                width="34.9998"
                height="4.99993"
                transform="rotate(-90 40 40)"
                fill={bgColor ? bgColor : "currentColor"}
            />
            <rect
                y="40"
                width="34.9998"
                height="4.99993"
                transform="rotate(-90 0 40)"
                fill={bgColor ? bgColor : "currentColor"}
            />
            <rect
                width="34.9995"
                height="34.9998"
                transform="matrix(-1 0 0 1 40 5.00003)"
                fill={bgColor ? bgColor : "currentColor"}
            />
        </svg>
    );
}
