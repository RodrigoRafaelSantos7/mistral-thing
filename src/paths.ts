// Routes for the application. These are used to navigate to different pages in the application.
export const indexPath = () => "/";

// (Auth)
export const loginPath = () => "/login";
export const magicLinkPath = () => "/magic-link";
export const loggedOutPath = () => "/logged-out";

// (Protected)/account
export const accountPath = () => "/account";
export const accountSubscriptionPath = () => "/account/subscription";
export const accountPreferencesPath = () => "/account/preferences";
export const accountModelsPath = () => "/account/models";
export const accountAppearancePath = () => "/account/appearance";

// (Protected)/(thread)
export const threadPath = (slug: string) => `/t/${slug}`;
