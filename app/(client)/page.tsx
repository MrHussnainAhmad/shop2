import ProductGrid from "@/components/common/ProductGrid";
import Banner from "@/components/pages/home/Banner";
import HomeCategories from "@/components/pages/home/HomeCategories";
import ShopbyBrands from "@/components/pages/home/ShopbyBrands";
import { getCategories } from "@/lib/api";
import { getSectionSettings } from "@/lib/sectionSettings";

export default async function Home() {
  const categories = await getCategories();
  const sectionSettings = await getSectionSettings();
  
  return (
    <div className="bg-custom-body pb-8">
      <Banner />
      <HomeCategories categories={categories} />
      <div className="py-10">
        <ProductGrid />
        {/* Shop by Brands - Only visible if admin enables it */}
        {sectionSettings.shopByBrandsVisible && (
          <ShopbyBrands />
        )}
      </div>
    </div>
  );
}
