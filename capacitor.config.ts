import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lechateau.langues",
  appName: "Le Château des Langues",
  webDir: "native-shell",
  server: {
    url: "https://le-chateau-des-langues.vercel.app",
    cleartext: false,
    allowNavigation: ["le-chateau-des-langues.vercel.app"],
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
