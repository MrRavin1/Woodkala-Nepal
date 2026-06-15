import { Head, useForm } from '@inertiajs/react';
import { useRef, type ReactNode } from 'react';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyOtp({ status, errors }: { status?: string; errors?: Record<string, string> }) {
    const form = useForm({ code: '' });
    const resendForm = useForm({});
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    function handleDigit(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const digits = form.data.code.split('');
        digits[index] = value.slice(-1);
        const newCode = digits.join('').padEnd(6, '').slice(0, 6);
        form.setData('code', newCode.trimEnd());
        if (value && index < 5) inputs.current[index + 1]?.focus();
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === 'Backspace' && !form.data.code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/email/verify-otp');
    }

    const codeError = form.errors.code || errors?.code;

    return (
        <>
            <Head title="Enter Verification Code" />

            {status === 'otp-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new code has been sent to your email.
                </div>
            )}

            {codeError && (
                <div className="mb-4 text-center text-sm font-medium text-red-600">
                    {codeError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <input
                            key={i}
                            ref={el => { inputs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={form.data.code[i] || ''}
                            onChange={e => handleDigit(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all focus:border-[#A67C52]"
                            style={{ borderColor: codeError ? '#ef4444' : '#DDD6CC' }}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={form.processing || form.data.code.length < 6}
                    className="w-full h-12 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #A67C52, #8B6340)' }}
                >
                    {form.processing ? 'Verifying…' : 'Verify Email'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-[#7A6A5A]">
                Didn't receive a code?{' '}
                <button
                    type="button"
                    disabled={resendForm.processing}
                    onClick={() => resendForm.post('/email/resend-otp')}
                    className="font-semibold hover:underline text-[#A67C52] disabled:opacity-50"
                >
                    {resendForm.processing ? 'Sending…' : 'Resend'}
                </button>
            </div>
        </>
    );
}

VerifyOtp.layout = (page: ReactNode) => (
    <AuthLayout
        title="Check your email"
        description="We sent a 6-digit code to your email address. Enter it below to verify your account."
    >
        {page}
    </AuthLayout>
);
