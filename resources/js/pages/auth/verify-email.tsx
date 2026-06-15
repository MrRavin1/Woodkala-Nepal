import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import type { ReactNode } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email Verification" />
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to your email address.
                </div>
            )}
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => (
    <AuthLayout title="Verify your email" description="Please check your email for a verification link.">
        {page}
    </AuthLayout>
);
