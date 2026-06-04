import { useNavigate } from "react-router-dom";

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 text-sm text-gray-700">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 text-primary hover:text-primary text-sm"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-500 mb-6">Last updated: May 2025</p>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-2">We collect the following information:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Email address and display name (during registration)</li>
          <li>URLs of websites you choose to block</li>
          <li>Records of when blocked sites are accessed (violation history)</li>
          <li>Extension installation status and heartbeat data</li>
          <li>Incognito mode permission status</li>
          <li>Payment information (processed by Gumroad; we do not store card details)</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>To provide the website blocking and accountability features</li>
          <li>To send email notifications to your designated accountability buddies</li>
          <li>To detect extension uninstallation and notify buddies</li>
          <li>To process subscription payments via Gumroad</li>
          <li>To enforce rate limits and prevent abuse</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">3. Information Sharing</h2>
        <p>
          We share your blocked site access attempts with your designated
          accountability buddies via email. We do not sell your personal
          information to third parties. Payment data is shared with Gumroad, our
          merchant of record, for subscription processing only.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">4. Data Storage</h2>
        <p>
          Your data is stored in Google Firebase (Firestore) and is protected by
          Firebase security rules. Only you can read and write your own user
          document. Violation records and heartbeat data are managed server-side
          only.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">5. Browser Permissions</h2>
        <p>
          The extension requests permissions including tabs, webNavigation,
          storage, and host permissions to function. These are used solely for
          blocking websites and detecting navigation to blocked sites. We do not
          track or store your general browsing history.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">6. Email Notifications</h2>
        <p>
          Accountability buddies receive email notifications when you visit
          blocked sites, when your blocked categories change, and if you
          uninstall the extension. By using the Service, you consent to these
          notifications being sent on your behalf.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">7. Data Deletion</h2>
        <p>
          You can request deletion of your account and associated data by
          contacting us. Removing the extension will trigger an uninstall
          notification but will not automatically delete your account data.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          users of significant changes through the extension or email.
        </p>
      </section>
    </div>
  );
}

export default Privacy;
