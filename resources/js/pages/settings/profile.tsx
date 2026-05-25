import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Mail, User, Phone, MapPin } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import DeleteUser from '@/components/delete-user';
import { send } from '@/routes/verification';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string; email_verified_at: string | null; phone?: string; address?: string } } }>().props;

    const inp = "w-full h-11 px-4 rounded-lg text-sm border border-gray-200 bg-gray-50 outline-none focus:border-[#A67C52] focus:bg-white transition-colors";
    const lbl = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <>
            <Head title="Profile Settings" />
            <Form {...ProfileController.update.form()} options={{ preserveScroll: true }}>
                {({ processing, recentlySuccessful, errors }) => (
                    <div className="max-w-xl space-y-6">

                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
                            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
                        </div>

                        {/* Fields */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={lbl}><User className="inline w-3.5 h-3.5 mr-1 text-gray-400" />Full Name</label>
                                    <input className={inp} name="name" defaultValue={auth.user.name} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <label className={lbl}><Mail className="inline w-3.5 h-3.5 mr-1 text-gray-400" />Email</label>
                                    <input className={inp} type="email" name="email" defaultValue={auth.user.email} required />
                                    <InputError message={errors.email} />
                                </div>
                                <div>
                                    <label className={lbl}><Phone className="inline w-3.5 h-3.5 mr-1 text-gray-400" />Phone</label>
                                    <input className={inp} name="phone" defaultValue={auth.user.phone ?? ''} placeholder="98XXXXXXXX" />
                                </div>
                                <div>
                                    <label className={lbl}><MapPin className="inline w-3.5 h-3.5 mr-1 text-gray-400" />Address</label>
                                    <input className={inp} name="address" defaultValue={auth.user.address ?? ''} placeholder="City, District" />
                                </div>
                            </div>

                            {mustVerifyEmail && !auth.user.email_verified_at && (
                                <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                                    Your email is not verified.{' '}
                                    <Link href={send()} as="button" className="font-semibold underline">Resend verification email</Link>
                                    {status === 'verification-link-sent' && <span className="ml-2 text-green-600">✓ Sent!</span>}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                {recentlySuccessful
                                    ? <span className="text-sm text-green-600 font-medium">✓ Changes saved</span>
                                    : <span />}
                                <button type="submit" disabled={processing}
                                    className="px-6 h-10 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition"
                                    style={{ background: '#A67C52' }}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Delete account */}
                        <div className="bg-white rounded-2xl border border-red-100 p-6">
                            <h2 className="text-sm font-bold text-red-600 mb-1">Delete Account</h2>
                            <p className="text-xs text-gray-500 mb-4">This will permanently delete your account and all associated data.</p>
                            <DeleteUser />
                        </div>

                    </div>
                )}
            </Form>
        </>
    );
}
