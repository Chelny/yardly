import { Platform, ScrollView, StyleSheet, Text } from "react-native";
import { APP_NAME, EMAIL } from "@/constants/app";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function PrivacyScreen(): React.JSX.Element {
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
        This Privacy Policy explains what information {APP_NAME} collects, how
        we use it, and the choices you have. It applies to the {APP_NAME} mobile
        and web application.
      </P>

      <H>1. Information We Collect</H>
      <P>
        Account information: first name, last name, email address, and password
        (stored in hashed form by our authentication provider).
      </P>
      <P>
        Property information: the home address you provide, so we can confirm
        service availability and route providers to the correct location.
      </P>
      <P>
        Usage information: which services you book, how many times each service
        has been used in a season, invoice history, and payment status.
      </P>
      <P>
        Device information: basic technical data such as app version and
        platform, used to keep the Service working and to diagnose errors.
      </P>

      <H>2. How We Use Your Information</H>
      <P>
        We use your information to create and secure your account, confirm
        service availability in your area, schedule and complete services,
        generate and process invoices, send service-related notifications, and
        improve the reliability of the app.
      </P>

      <H>3. Sharing</H>
      <P>
        We share information with service providers who help us operate the app,
        including our authentication provider, payment processor, and address
        lookup service. We do not sell your personal information. We may
        disclose information if required by law.
      </P>

      <H>4. Data Retention</H>
      <P>
        We retain account and invoice records for as long as your account is
        active and for a reasonable period afterward to comply with legal and
        accounting obligations. You may request deletion of your account at any
        time, subject to those obligations.
      </P>

      <H>5. Security</H>
      <P>
        Passwords are handled by our authentication provider and are never
        stored in plain text. Data in transit is encrypted. No system is
        perfectly secure, but we take reasonable measures to protect your
        information.
      </P>

      <H>6. Your Choices</H>
      <P>
        You can update your profile information in the app, opt out of
        non-essential notifications, and request a copy or deletion of your data
        by contacting us at the address below.
      </P>

      <H>7. Children</H>
      <P>
        The Service is not directed at children under 13, and we do not
        knowingly collect personal information from children.
      </P>

      <H>8. Contact</H>
      <P>Privacy questions can be sent to {EMAIL.PRIVACY}.</P>

      <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
        This is placeholder legal text for a portfolio project. It is not legal
        advice. Replace it with a policy reviewed by a qualified professional
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
