export const PLATFORMS = [
  { key: "globoplay", label: "Globoplay" },
  { key: "max", label: "HBO Max" },
  { key: "disney", label: "Disney+" },
  { key: "prime", label: "Prime Video" },
  { key: "appletv", label: "Apple TV+" },
  { key: "netflix", label: "Netflix" },
] as const;

export type PlatformKey = typeof PLATFORMS[number]["key"];
