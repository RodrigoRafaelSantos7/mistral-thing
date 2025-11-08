import { getUrl } from "@/lib/utils";

export const SITE_CONFIG = {
  name: "Mistral Thing",
  url: getUrl(),
  ogImage: `${getUrl()}/og/home`,
  description:
    "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral AI.",
  links: {
    github: "https://github.com/RodrigoRafaelSantos7/MistralThing",
  },
};

export type SITE_CONFIG_TYPE = typeof SITE_CONFIG;
