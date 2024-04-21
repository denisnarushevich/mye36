import { ReactNode } from "react";

export default function BaseLayout({
    children,
    header,
    overlay,
}: {
    children?: ReactNode;
    header?: ReactNode;
    overlay?: ReactNode;
}) {
    return (
        <div className="h-[100vh]">
            <div className="h-[100dvh]">{children}</div>
            <div className="absolute inset-0 overflow-auto flex flex-col">
                <div className="sticky top-0">{header}</div>
                <div className="grow">{overlay}</div>
            </div>
        </div>
    );
}
