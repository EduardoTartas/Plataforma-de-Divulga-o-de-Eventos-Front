import QueryProvider from "../../providers/queryProvider";


export default function TotemLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    );
}