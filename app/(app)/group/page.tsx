import { requireGroupAdmin } from "@/lib/auth";

export default async function GroupPage() {
  await requireGroupAdmin();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Nhóm</h1>
      <p className="mt-2 text-[#666666]">Sắp có ở P5.</p>
    </>
  );
}
