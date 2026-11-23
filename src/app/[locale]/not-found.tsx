import { getMessages } from "next-intl/server";
import { NotFoundView } from "@/components/not-found/not-found-view";

// Shown when a page under /pt calls notFound(); the root layout supplies the
// header and footer.
export default async function NotFound() {
  const messages = await getMessages();
  return <NotFoundView copy={messages.NotFound} />;
}
