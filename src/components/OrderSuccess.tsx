import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OrderSuccessProps {
    orderId: string;
    email?: string | null;
}

export default function OrderSuccess({ orderId, email }: OrderSuccessProps) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-dark-900">Order Confirmed!</h1>
            <p className="mb-8 max-w-md text-dark-500">
                Thank you for your purchase. Your order <span className="font-medium text-dark-900">#{orderId.slice(0, 8)}</span> has been confirmed.
                {email && (
                    <>
                        {" "}A confirmation email has been sent to <span className="font-medium text-dark-900">{email}</span>.
                    </>
                )}
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="rounded-full bg-dark-900 px-8 py-3 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/account/orders"
                    className="rounded-full border border-light-200 bg-white px-8 py-3 text-base font-medium text-dark-900 transition-colors hover:bg-light-50"
                >
                    View Order
                </Link>
            </div>
        </div>
    );
}
