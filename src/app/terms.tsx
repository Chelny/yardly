import { Platform, ScrollView, StyleSheet, Text } from "react-native";
import { APP_NAME, EMAIL } from "@/constants/app";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function TermsScreen(): React.JSX.Element {
  const { colors } = useTheme();

  const H = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => (
    <Text style={[styles.h2, { color: colors.text }]}>{children}</Text>
  );

  const P = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => (
    <Text style={[styles.p, { color: colors.textSecondary }]}>{children}</Text>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={[styles.updated, { color: colors.textSecondary }]}>
        Last updated: October 21, 2026
      </Text>

      <P>
        These Terms of Service (&quot;Terms&quot;) govern your use of the{" "}
        {APP_NAME} mobile and web application (&quot;the Service&quot;). By
        creating an account or booking a service, you agree to these Terms.
      </P>

      <H>1. Services</H>
      <P>
        {APP_NAME} connects homeowners with seasonal outdoor property services
        including snow removal, lawn mowing, hedge trimming, fertilization,
        plant watering, and weed removal. Each service is subject to
        availability in your area and to a maximum number of uses per season,
        which is displayed in the app before you book.
      </P>

      <H>2. Accounts</H>
      <P>
        You must provide accurate information when creating an account,
        including a valid home address so we can confirm service availability.
        You are responsible for keeping your login credentials secure and for
        all activity under your account.
      </P>

      <H>3. Bookings and Pricing</H>
      <P>
        Prices for each service are shown in the app at the time of booking.
        Seasonal caps are enforced per service per property. Once a seasonal cap
        is reached, the service becomes unavailable until the next season.
        Invoices are generated after a service is marked complete and remain
        payable according to the terms shown on the invoice.
      </P>

      <H>4. Payments</H>
      <P>
        Payments are processed by our third-party payment provider. By providing
        payment information, you authorize us to charge the amounts shown on
        your invoices. Failed payments may result in suspension of service until
        the balance is settled.
      </P>

      <H>5. Cancellations and Refunds</H>
      <P>
        You may cancel a scheduled service before the provider is dispatched.
        Refund eligibility depends on how close to the scheduled time the
        cancellation occurs and is described at the point of cancellation.
        Services already completed are non-refundable.
      </P>

      <H>6. Acceptable Use</H>
      <P>
        You agree not to misuse the Service, including by submitting false
        addresses, attempting to exceed seasonal caps through multiple accounts,
        or interfering with the app&apos;s normal operation.
      </P>

      <H>7. Limitation of Liability</H>
      <P>
        To the maximum extent permitted by law, {APP_NAME} is not liable for
        indirect, incidental, or consequential damages arising from your use of
        the Service. Our total liability for any claim is limited to the amount
        you paid for the service giving rise to the claim.
      </P>

      <H>8. Changes to These Terms</H>
      <P>
        We may update these Terms from time to time. If we make material
        changes, we will notify you in the app before the changes take effect.
        Continued use of the Service after changes take effect constitutes
        acceptance of the updated Terms.
      </P>

      <H>9. Contact</H>
      <P>Questions about these Terms can be sent to {EMAIL.SUPPORT}.</P>

      <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
        This is placeholder legal text for a portfolio project. It is not legal
        advice. Replace it with terms reviewed by a qualified professional
        before any real-world use.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  updated: { fontSize: 13, marginBottom: Spacing.four },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  p: { fontSize: 15, lineHeight: 23, marginBottom: Spacing.two },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: Spacing.five,
    fontStyle: "italic",
    ...(Platform.OS === "web" ? ({ opacity: 0.8 } as object) : {}),
  },
});
