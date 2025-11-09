import { BotIcon, PaintbrushIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
} from "@/paths";

export const ACCOUNT_PAGES = [
  {
    title: "Account",
    url: accountPath(),
    icon: UserIcon,
  },

  {
    title: "Preferences",
    url: accountPreferencesPath(),
    icon: SettingsIcon,
  },
  {
    title: "Models",
    url: accountModelsPath(),
    icon: BotIcon,
  },
  {
    title: "Appearance",
    url: accountAppearancePath(),
    icon: PaintbrushIcon,
  },
];
