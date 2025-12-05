export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="flex-1 flex items-center justify-center p-4">
                    {children}
            </div>
        </div>
    );
}