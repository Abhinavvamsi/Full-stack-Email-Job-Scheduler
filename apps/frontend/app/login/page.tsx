'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error(error);
            alert('Login failed: ' + error.message);
            setIsLoading(false);
        }
    };

    // Magic Link Fallback
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Placeholder if we add password auth later
    const [sent, setSent] = useState(false);

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        });
        setIsLoading(false);
        if (error) {
            alert('Error: ' + error.message);
        } else {
            setSent(true);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="bg-white px-8 py-10 w-full max-w-[440px] text-center border border-gray-100 shadow-sm rounded-xl">
                <h1 className="text-3xl font-bold text-foreground mb-8">Login</h1>

                <Button
                    className="w-full h-12 flex items-center justify-center gap-3 bg-[#E9F2EF] text-[#333] hover:bg-[#D8E6E0] border-none shadow-none font-medium mb-6 rounded-md"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    {/* Google Icon SVG */}
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238541)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.424 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.424 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                        </g>
                    </svg>
                    Login with Google
                </Button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-gray-400 font-medium">or sign up through email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {sent ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm border border-green-200">
                        Check your email for the login link!
                    </div>
                ) : (
                    <form onSubmit={handleMagicLink} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email ID"
                            className="w-full h-12 bg-input-bg border-none rounded-md px-4 text-base placeholder:text-gray-400"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full h-12 bg-input-bg border-none rounded-md px-4 text-base placeholder:text-gray-400"
                            disabled // Password not implemented yet with Magic Link flow logic simplifiction
                        />
                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary text-white font-medium text-base rounded-md hover:bg-green-600 shadow-lg shadow-green-200/50"
                            disabled={isLoading}
                        >
                            Login
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
