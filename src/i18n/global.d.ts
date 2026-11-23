import type messages from "../../messages/pt.json";
import type { routing } from "./routing";

// Strict typing for next-intl: locales come from the routing config and
// translation keys are checked against the Portuguese messages at compile time.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
