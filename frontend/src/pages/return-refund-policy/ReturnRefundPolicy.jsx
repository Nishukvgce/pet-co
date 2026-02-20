import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';

const ReturnRefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Return &amp; Refund Policy | PET&amp;CO</title>
        <meta
          name="description"
          content="PET&CO Return and Refund Policy - Learn about our return, exchange, and store credit terms and conditions."
        />
      </Helmet>
      <Header />

      <main style={{ background: '#fff', minHeight: '100vh' }}>

        {/* Page container */}
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '48px 24px 72px' }}>

          {/* Breadcrumb */}
          <nav style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
            <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#333' }}>Return &amp; Refund Policy</span>
          </nav>

          {/* Header block */}
          <div style={{ borderBottom: '2px solid #e5e5e5', paddingBottom: '24px', marginBottom: '36px' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#999', marginBottom: '10px' }}>
              PET &amp; CO — Policy Document
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0 0 8px' }}>
              Return &amp; Refund Policy
            </h1>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
              Effective for all orders placed on petandco.com &nbsp;|&nbsp; Last Updated: February 2025
            </p>
          </div>

          {/* Introduction */}
          <p style={styles.para}>
            PET &amp; CO's sole aim is to make pets happy and ease paw-renting. We want to help pets and their
            parents live harmoniously and lead happy, healthy lives. We aspire to deliver unique products sourced
            from the best manufacturers in the country and abroad.
          </p>
          <p style={styles.para}>
            Our policies are made keeping in mind the betterment of relationships with our customers. These policies
            assure you that, subject to the following conditions, if any product purchased from PET &amp; CO is
            flawed or not suitable for you/your pet, we will happily repair or replace the merchandise or provide
            you with a PET &amp; CO Store Credit for your return.
          </p>

          <Divider />

          {/* Section 1 */}
          <Section number="1" title="General Return Policy">
            <p style={styles.para}>
              If you decide you no longer want a product you ordered, you can return it within <strong>7 days</strong> from
              the date of delivery for an exchange or store credit. However, the item and packaging must be undamaged
              and in resalable condition when received by PET &amp; CO.
            </p>
            <p style={styles.para}>
              Please note that a <strong>reverse pickup fee</strong> will apply. If we are unable to arrange pickup due
              to service unavailability in your area, the customer will need to ship the product back to our store at
              their own expense.
            </p>
            <p style={styles.para}>
              We <strong>do not provide cash refunds</strong> for returns or exchanges except in special approved cases.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Each purchase is eligible for only <strong>one exchange</strong>. Subsequent exchange requests will not be accommodated.</li>
              <li style={styles.listItem}>If the exchange product is unavailable, store credit will be offered.</li>
              <li style={styles.listItem}>Reverse pickup fee of <strong>₹100–₹150 per product</strong> will be charged.</li>
            </ul>
          </Section>

          <Divider />

          {/* Section 2 */}
          <Section number="2" title="Wrong, Damaged or Expired Product">
            <p style={styles.para}>
              Please inform us within <strong>48 hours</strong> from the date of delivery with the following:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Clear product images</li>
              <li style={styles.listItem}>Mandatory unboxing video</li>
            </ul>
            <p style={styles.para}>
              Both are required for verification and processing. Claims raised after 48 hours of delivery will not be entertained.
            </p>
          </Section>

          <Divider />

          {/* Section 3 */}
          <Section number="3" title="Conditions Where Return / Replacement Will Not Be Accepted">
            <p style={styles.para}>Returns or exchanges will not be accepted under the following circumstances:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Used or altered products</li>
              <li style={styles.listItem}>Original packaging or labels missing</li>
              <li style={styles.listItem}>Request generated after 7 days from delivery</li>
              <li style={styles.listItem}>Not sharing images/videos within 48 hours of delivery</li>
            </ul>
          </Section>

          <Divider />

          {/* Section 4 */}
          <Section number="4" title="Return Eligibility">
            <p style={styles.para}>
              The following items are <strong>NOT eligible for return or exchange</strong> unless received damaged or faulty:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Edible &amp; perishable items (food, treats, supplements)</li>
              <li style={styles.listItem}>Personalized products &amp; engraved ID tags</li>
              <li style={styles.listItem}>Bedding, mats, beds, sofa covers, blankets</li>
              <li style={styles.listItem}>Cat/Dog litter, trays, toys &amp; accessories</li>
              <li style={styles.listItem}>Cat furniture &amp; scratchers</li>
              <li style={styles.listItem}>Grooming products</li>
              <li style={styles.listItem}>Leashes &amp; harness</li>
            </ul>
            <p style={styles.note}>
              Please refer to individual product pages for detailed return eligibility.
            </p>
            <p style={styles.para}>
              Only <strong>one-time exchange or return per product</strong> is allowed. Second-time exchanges or returns are not permitted.
            </p>

            <div style={styles.callout}>
              <strong>Important Note:</strong> Dog shoes, clothes, and all customizable items are
              <strong> non-refundable and non-exchangeable</strong>.
            </div>
          </Section>

          <Divider />

          {/* Section 5 */}
          <Section number="5" title="When Store Credit / Exchange Can Be Denied">
            <p style={styles.para}>No store credit or exchange will be provided if the item is:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Without original packaging</li>
              <li style={styles.listItem}>Broken, unclean, or worn (unless defective)</li>
            </ul>
            <p style={styles.para}>
              After inspection at our store, if the return is rejected, you may request the item to be shipped back
              at your own cost. Otherwise, it may be donated.
            </p>
          </Section>

          <Divider />

          {/* Section 6 */}
          <Section number="6" title="Cancellation of Orders">
            <p style={styles.para}>
              If you wish to cancel your order before shipment, please contact our support team immediately.
              <strong> Orders cannot be cancelled once shipped.</strong>
            </p>
            <p style={styles.subHeading}>Prepaid Orders</p>
            <p style={styles.para}>
              If delivery is rejected, the refund will be processed to the original payment method after inspection.
            </p>
            <p style={styles.subHeading}>Cash On Delivery (COD)</p>
            <p style={styles.para}>
              If delivery is rejected, no refunds or store credits will be issued.
            </p>
          </Section>

          <Divider />

          {/* Section 7 */}
          <Section number="7" title="PET & CO Store Credit Policy">
            <ul style={styles.list}>
              <li style={styles.listItem}>Store credit will be issued in the form of a <strong>credit invoice</strong>.</li>
              <li style={styles.listItem}>It can be used for your next purchase.</li>
              <li style={styles.listItem}>To use store credit, place a new order selecting the <strong>COD payment option</strong>.</li>
              <li style={styles.listItem}>Share your Order ID with us; we will deduct the credit amount before dispatch.</li>
              <li style={styles.listItem}>Store credit is valid for <strong>3 months</strong> from the date of issue.</li>
              <li style={styles.listItem}>Store credit is for <strong>one-time use only</strong> and is non-transferable.</li>
            </ul>
          </Section>

          <Divider />

          {/* Section 8 */}
          <Section number="8" title="How To Place a Return Request">
            <p style={styles.para}>Please email us with the following:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Product images</li>
              <li style={styles.listItem}>Unboxing video</li>
            </ul>
            <p style={styles.para}>
              Our support team will coordinate further. If pickup service is unavailable in your area, please ship
              the product to the address below.
            </p>

            {/* Contact block */}
            <div style={styles.contactBlock}>
              <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#111' }}>PET &amp; CO</p>
              <p style={{ margin: '0 0 2px', color: '#444', fontSize: '14px' }}>#8 1st Main Road, 12th Cross</p>
              <p style={{ margin: '0 0 2px', color: '#444', fontSize: '14px' }}>Pailayout, Mahadevapura</p>
              <p style={{ margin: '0 0 12px', color: '#444', fontSize: '14px' }}>Bangalore – 560016, Karnataka, India</p>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#444' }}>
                📧&nbsp;<a href="mailto:petandcompany2211@gmail.com" style={styles.link}>petandcompany2211@gmail.com</a>
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
                📞&nbsp;<a href="tel:9008003096" style={styles.link}>9008003096</a>
              </p>
            </div>
          </Section>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #e5e5e5', marginTop: '48px', paddingTop: '20px' }}>
            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
              © 2025 PET &amp; CO. This policy is subject to change without prior notice. For the most current version, please visit our website.
            </p>
          </div>

        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
};

/* ─── Sub-components ────────────────────────────────────────────── */

const Section = ({ number, title, children }) => (
  <section style={{ marginBottom: '8px' }}>
    <h2 style={{
      fontSize: '16px',
      fontWeight: '700',
      color: '#111',
      margin: '0 0 16px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '10px',
    }}>
      <span style={{
        fontSize: '12px',
        fontWeight: '700',
        color: '#fff',
        background: '#c05e00',
        borderRadius: '4px',
        padding: '2px 8px',
        flexShrink: 0,
      }}>
        {number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const Divider = () => (
  <hr style={{ border: 'none', borderTop: '1px solid #ebebeb', margin: '32px 0' }} />
);

/* ─── Shared styles ─────────────────────────────────────────────── */

const styles = {
  para: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#444',
    margin: '0 0 14px',
  },
  list: {
    margin: '0 0 14px',
    paddingLeft: '22px',
  },
  listItem: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#444',
    marginBottom: '4px',
  },
  note: {
    fontSize: '13px',
    color: '#888',
    fontStyle: 'italic',
    margin: '0 0 14px',
  },
  callout: {
    background: '#fff8f0',
    border: '1px solid #ffd8b0',
    borderLeft: '4px solid #c05e00',
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#444',
    lineHeight: '1.7',
    margin: '16px 0 0',
  },
  subHeading: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#222',
    margin: '16px 0 6px',
    textDecoration: 'underline',
    textDecorationColor: '#ddd',
  },
  contactBlock: {
    background: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    padding: '16px 20px',
    marginTop: '16px',
  },
  link: {
    color: '#c05e00',
    textDecoration: 'none',
  },
};

export default ReturnRefundPolicy;
