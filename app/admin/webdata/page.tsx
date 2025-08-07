import WebDataForm from '@/components/admin/webdata/WebDataForm';
import { getWebData } from '@/lib/api'; // Assuming you'll create this function

export default async function WebDataPage() {
  const webData = await getWebData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Website Data</h1>
      <WebDataForm initialData={webData} />
    </div>
  );
}
