import { PublicHome } from "@/components/product/PublicHome";
import { getPublicSiteFromDb } from "@/lib/db/diagauto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Home() {
  const site = JSON.parse(JSON.stringify(getPublicSiteFromDb()));
  return <PublicHome site={site} />;
}
