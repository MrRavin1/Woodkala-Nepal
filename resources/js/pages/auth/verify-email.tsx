import { Form, Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
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

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Resend verification email
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => (
    <AuthLayout
        title="Verify your email"
        description="Thanks for signing up! Please verify your email address by clicking the link we sent you."
    >
        {page}
    </AuthLayout>
);
