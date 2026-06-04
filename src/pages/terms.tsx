import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 text-sm text-gray-700">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 text-primary hover:text-primary text-sm"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-500 mb-6">Last updated: May 2025</p>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By installing and using the FocusBuddy Chrome Extension ("Service"),
          you agree to be bound by these Terms of Service. If you do not agree,
          do not use the Service.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">2. Description of Service</h2>
        <p>
          FocusBuddy is a productivity extension that blocks distracting
          websites and provides accountability through a buddy system. Users can
          designate accountability buddies who receive email notifications when
          blocked sites are accessed.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">3. Account Registration</h2>
        <p>
          You must provide accurate information when creating an account. You are
          responsible for maintaining the security of your account credentials.
          You must be at least 13 years old to use this Service.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">4. Buddy System</h2>
        <p>
          When you add an accountability buddy, they will receive email
          notifications about your browsing activity on blocked sites. By adding
          a buddy, you consent to sharing this information with them. Buddies
          you add will also be notified if you uninstall the extension.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">5. Subscriptions and Payments</h2>
        <p>
          The Service offers a free tier and a paid Premium subscription at
          $5 per month. Premium subscriptions are billed monthly through
          Gumroad, our merchant of record. Gumroad handles all payment processing,
          tax collection, and invoicing. You may cancel at any time.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">6. Penalty System</h2>
        <p>
          The penalty amounts configured between users and their buddies are
          agreements between those parties. FocusBuddy does not process, collect,
          or enforce penalty payments. These are honor-system arrangements.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">7. Acceptable Use</h2>
        <p>
          You agree not to misuse the Service, including but not limited to:
          using it to harass others, attempting to circumvent rate limits, or
          using automated means to access the Service beyond normal use.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">8. Limitation of Liability</h2>
        <p>
          The Service is provided "as is" without warranties of any kind.
          FocusBuddy is not liable for any damages arising from use of the
          Service, including but not limited to loss of data or interruption of
          service.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">9. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          Service after changes constitutes acceptance of the new terms.
        </p>
      </section>
    </div>
  );
}

export default Terms;
