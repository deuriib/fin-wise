import { FinWiseLogo } from "@/components/icons/logo";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <FinWiseLogo className="h-8 w-auto" />
          <span className="sr-only">FinWise</span>
        </Link>
        <div className="ml-auto">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Back to App
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4 md:px-6 prose">
        <h1>Terms of Service</h1>
        <p>Last updated: July 26, 2024</p>
        
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the FinWise application (the "Service") operated by FinWise ("us", "we", or "our").</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This is a placeholder document.</p>
        
        <h2>2. Accounts</h2>
        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        
        <h2>3. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of FinWise and its licensors. The content in this document is for demonstration purposes only.</p>
        
        <h2>4. Links To Other Web Sites</h2>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by FinWise. FinWise has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.</p>
        
        <h2>5. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

        <h2>6. Limitation Of Liability</h2>
        <p>In no event shall FinWise, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        <h2>7. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of the land, without regard to its conflict of law provisions. This is not a legally binding document.</p>
        
        <h2>8. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
        
        <h2>9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </main>
    </div>
  );
}
