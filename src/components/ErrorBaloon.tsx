export default function ErrorBaloon({
    children,
}: {
    children: React.ReactNode;
}) {
    return <span className="error">{children}</span>;
}
