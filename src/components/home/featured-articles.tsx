import { getFeaturedArticles } from "@/lib/cms";
import { FeaturedArticlesAoVivo } from "./featured-articles-ao-vivo";

export function FeaturedArticles() {
  return <FeaturedArticlesAoVivo doBuild={getFeaturedArticles()} />;
}
