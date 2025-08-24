import { FinWiseLogo } from "@/components/icons/logo";
import Link from "next/link";

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p>Last updated: July 26, 2024</p>

        <p>FinWise ("us", "we", or "our") operates the FinWise application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. This is a placeholder document and not legally binding.</p>

        <h2>1. Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you. Types of Data Collected include Personal Data such as email address, first name and last name, and usage data.</p>
        
        <h2>2. Use of Data</h2>
        <p>FinWise uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, to provide customer care and support, and to provide analysis or valuable information so that we can improve the Service.</p>
        
        <h2>3. Data Security</h2>
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        
        <h2>4. Service Providers</h2>
        <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        
        <h2>5. Children's Privacy</h2>
        <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.</p>
        
        <h2>6. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        
        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </main>
    </div>
  );
}
