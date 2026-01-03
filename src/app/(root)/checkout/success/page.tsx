import OrderSuccess from "@/components/OrderSuccess";
import { getOrder } from "@/lib/actions/orders";
import { redirect } from "next/navigation";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string; orderId?: string }>;
}) {
    const { session_id, orderId } = await searchParams;

    // If we have a session_id, we might want to fetch the order by session_id
    // But getOrder expects orderId.
    // Let's update getOrder to support fetching by sessionId or update this page logic.
    // Actually, createOrder returns orderId.
    // But here we are redirecting from Stripe with session_id.
    // We need to find the order by session_id.

    // Let's modify getOrder to optionally take sessionId or create a new action getOrderBySessionId.
    // For now, let's assume we can fetch by orderId if passed, or we need to find it.

    // Wait, the webhook creates the order. The success page just shows it.
    // But the webhook might be slower than the redirect.
    // So the success page might need to wait or poll?
    // Or we can try to create the order here if it doesn't exist?
    // But that duplicates logic.
    // Best practice: Webhook handles creation. Success page polls or just shows "Processing" if not found?
    // Or, we can fetch the session here and create the order if it doesn't exist (idempotent).
    // Let's use createOrder(session_id) here too? It checks if order exists.

    let order;
    if (session_id) {
        // Try to find order by session ID
        // We need a way to find order by session ID.
        // Let's use a direct DB query here or add a method to orders.ts
        // Actually, createOrder is idempotent. We can call it here to ensure order exists and get its ID.
        // This handles the race condition where webhook hasn't fired yet.
        const id = await import("@/lib/actions/orders").then(mod => mod.createOrder(session_id));
        order = await getOrder(id);
    } else if (orderId) {
        order = await getOrder(orderId);
    }

    if (!order) {
        redirect("/");
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <OrderSuccess orderId={order.id} email={order.email} />
        </div>
    );
}
