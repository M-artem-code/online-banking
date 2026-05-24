import { getApiUrl } from "@/shared/config/env";

export function redirectToGoogleAuth() {
  window.location.href = `${getApiUrl()}/auth/google`;
}
