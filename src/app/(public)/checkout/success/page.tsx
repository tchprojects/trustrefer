import { Suspense } from "react";
import { SuccessContent } from "@/components/checkout/SuccessContent";

export const metadata = { title: "Payment successful — TrustRefer" };

// Suspense is required because SuccessContent uses useSearchParams
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
