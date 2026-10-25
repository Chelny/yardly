import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewInstance,
} from "react-native";
import {
  LocationAutocomplete,
  LocationAutocompleteRef,
  type LocationSuggestion,
  OpenStreetMapResult,
} from "@julekgwa/react-native-places-autocomplete";
import { LocateFixedIcon, Mail } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { Fonts, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  agreement?: string;
}

export default function SignUpScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const addressWrapperRef = useRef<ViewInstance>(null);
  const [isAddressFocused, setIsAddressFocused] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const locationAutocompleteRef = useRef<LocationAutocompleteRef>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<boolean>(false);

  const handleAddressSelect = async (
    location: LocationSuggestion<OpenStreetMapResult>
  ): Promise<void> => {
    setErrors({});
    await reverseGeocodeLocation(+location.lat, +location.lon);
  };

  const handleUseMyLocation = async (): Promise<void> => {
    setIsLocating(true);
    setErrors({});

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrors({ address: "Permission to access location was denied" });
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      await reverseGeocodeLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (err) {
      setErrors({ address: `Error: ${(err as Error).message}` });
    } finally {
      setIsLocating(false);
    }
  };

  const reverseGeocodeLocation = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setSelectedAddress(reverseGeocode[0] || null);
      setSelectedCoords({ latitude, longitude });
      locationAutocompleteRef.current?.clear();
    } catch (err) {
      setErrors({ address: `Error: ${(err as Error).message}` });
    }
  };

  const handleSignUp = async (): Promise<void> => {
    const nextErrors: FieldErrors = {};

    if (!firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!password) nextErrors.password = "Password is required.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (password && password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!selectedAddress) nextErrors.address = "Select your home address.";
    if (!agreed)
      nextErrors.agreement =
        "You must accept the Terms of Service and Privacy Policy.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: "yardly://",
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          address_line: [
            selectedAddress?.streetNumber,
            selectedAddress?.street,
            selectedAddress?.city,
            selectedAddress?.region,
            selectedAddress?.postalCode,
            selectedAddress?.country,
          ]
            .filter(Boolean)
            .join(", "),
          latitude: selectedCoords?.latitude ?? null,
          longitude: selectedCoords?.longitude ?? null,
        },
      },
    });

    setLoading(false);

    if (authError) {
      setErrors({ email: authError.message });
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <View
        style={[
          styles.flex,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            paddingHorizontal: Spacing.four,
          },
        ]}
      >
        <Mail
          size={48}
          color={colors.primary}
          style={{ alignSelf: "center", marginBottom: Spacing.four }}
        />
        <ThemedText
          type="h3"
          align="center"
          style={{ marginBottom: Spacing.two }}
        >
          Check your inbox
        </ThemedText>
        <ThemedText
          type="muted"
          align="center"
          style={{ marginBottom: Spacing.five }}
          testID="sign-up_text_confirmation-message"
        >
          We sent a confirmation link to{" "}
          <ThemedText
            type="muted"
            style={{ fontWeight: "700" }}
          >
            {email}
          </ThemedText>
          . Click it to activate your account and sign in.
        </ThemedText>
        <Button
          label="Back to Sign In"
          variant="outline"
          onPress={() => router.replace("/sign-in")}
          testID="sign-up_button_back-to-sign-in"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedText
          type="muted"
          style={styles.subtitle}
        >
          Start managing your seasonal yard care.
        </ThemedText>

        <View style={styles.gap}>
          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                label="First name"
                required
                placeholder="Jane"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
                testID="sign-up_input-text_first-name"
                error={errors.firstName}
              />
            </View>
            <View style={styles.half}>
              <Input
                label="Last name"
                required
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
                testID="sign-up_input-text_last-name"
                error={errors.lastName}
              />
            </View>
          </View>

          <Input
            label="Email"
            required
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            testID="sign-up_input-email_email"
            error={errors.email}
          />

          <Input
            label="Password"
            required
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            hint="At least 8 characters."
            editable={!loading}
            testID="sign-up_input-password_password"
            error={errors.password}
          />
          <Input
            label="Confirm password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
            testID="sign-up_input-password_confirm-password"
            error={errors.confirmPassword}
          />

          <View style={styles.field}>
            <ThemedText type="label">Home address</ThemedText>
            <View style={styles.autocompleteWrapper}>
              <View
                ref={addressWrapperRef}
                style={{ flex: 1 }}
                onFocus={() => setIsAddressFocused(true)}
                onBlur={() => setIsAddressFocused(false)}
              >
                <LocationAutocomplete
                  ref={
                    locationAutocompleteRef as React.RefObject<LocationAutocompleteRef>
                  }
                  provider="openstreetmap"
                  placeholder="Start typing your address..."
                  queryOptions={{ countrycodes: "ca,us", limit: 5 }}
                  onLocationSelect={handleAddressSelect}
                  containerStyle={{ zIndex: 10, margin: 0, flex: 1 }}
                  inputContainerStyle={{
                    backgroundColor: colors.input,
                    borderWidth: 1,
                    borderColor: isAddressFocused
                      ? colors.primary
                      : colors.border,
                    borderRadius: Platform.OS === "ios" ? 10 : Radius.md,
                    minHeight: TouchTarget,
                    paddingHorizontal: Spacing.two,
                    paddingVertical: Spacing.half,
                    // Remove shadow for Android and iOS
                    elevation: 0,
                    shadowColor: "transparent",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0,
                    shadowRadius: 0,
                  }}
                  inputStyle={{
                    paddingHorizontal: Spacing.one,
                    paddingVertical: 0,
                  }}
                  textStyle={{
                    color: colors.text,
                    fontSize: 16,
                    fontFamily: Platform.OS === "ios" ? Fonts.sans : undefined,
                  }}
                  suggestionStyle={{
                    paddingVertical: Spacing.two,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                />
              </View>
              <Pressable
                style={styles.findMyLocation}
                disabled={isLocating}
                testID="sign-up_button_find-my-location"
                onPress={handleUseMyLocation}
              >
                <LocateFixedIcon
                  size={20}
                  color={isLocating ? colors.primary : colors.text}
                />
              </Pressable>
            </View>

            {errors.address ? (
              <ThemedText
                type="caption"
                themeColor="destructive"
              >
                {errors.address}
              </ThemedText>
            ) : null}

            {selectedAddress && (
              <ThemedText
                type="caption"
                themeColor="textSecondary"
                testID="sign-up_text_selected-address"
              >
                {selectedAddress.name || ""}
                {"\n"}
                {selectedAddress.street || ""}
                {"\n"}
                {selectedAddress.city || ""}, {selectedAddress.region || ""}{" "}
                {selectedAddress.postalCode || ""}
                {"\n"}
                {selectedAddress.country || ""}
              </ThemedText>
            )}
          </View>

          <Checkbox
            checked={agreed}
            onCheckedChange={setAgreed}
            label={
              <ThemedText
                type="caption"
                themeColor="textSecondary"
              >
                By signing up you agree to our{" "}
                <TextLink
                  href="/terms"
                  variant="inline"
                >
                  Terms of Service
                </TextLink>{" "}
                and{" "}
                <TextLink
                  href="/privacy"
                  variant="inline"
                >
                  Privacy Policy
                </TextLink>
                .
              </ThemedText>
            }
            required
            testID="sign-up_checkbox_agree"
            error={errors.agreement}
          />

          <Button
            label={loading ? "Creating account..." : "Sign Up"}
            disabled={!agreed || loading}
            onPress={handleSignUp}
            testID="sign-up_button_sign-up"
          />

          <View style={styles.footer}>
            <ThemedText type="muted">Already have an account? </ThemedText>
            <TextLink
              href="/sign-in"
              testID="sign-up_link_sign-in"
            >
              Sign In
            </TextLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  subtitle: { marginBottom: Spacing.five },
  gap: { gap: Spacing.three },
  row: { flexDirection: "row", gap: Spacing.two },
  half: { flex: 1 },
  field: { gap: Spacing.one },
  autocompleteWrapper: { flexDirection: "row", alignItems: "flex-start" },
  findMyLocation: { padding: Spacing.two, marginTop: Spacing.one },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.three,
  },
});
