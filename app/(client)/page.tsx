import ProductGrid from "@/components/common/ProductGrid";
import Banner from "@/components/pages/home/Banner";
import HomeCategories from "@/components/pages/home/HomeCategories";
import ShopbyBrands from "@/components/pages/home/ShopbyBrands";
import { getCategories } from "@/lib/api";

export default async function Home() {
  const categories = await getCategories();
  return (
    <div className="bg-custom-body pb-8">
      <Banner />
      <HomeCategories categories={categories} />
      <div className="py-10">
        <ProductGrid />
        {/*ShopByBrands*/}
        {/* Only Visible if Admin Wants */}
        <ShopbyBrands />
      </div>
    </div>
  );
}
