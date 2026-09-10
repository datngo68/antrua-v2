import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <div className="flex min-h-[100dvh] items-center bg-background px-4">
      <Card className="w-full max-w-md md:ml-[10vw]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            AnTrua
          </CardTitle>
          <CardDescription>Đăng nhập để quản lý chi tiêu nhóm</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
