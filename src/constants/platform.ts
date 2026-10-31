import { Platform } from "expo";

export const isMobile: boolean =
  Platform.OS === "ios" || Platform.OS === "android";
export const isWeb: boolean = Platform.OS === "web";
export const isAppleDevice: boolean =
  Platform.OS === "ios" || Platform.OS === "macos";
