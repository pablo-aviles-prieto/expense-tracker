import BreadCrumb from "@/components/breadcrumb";
import { ProfileBlock } from "@/components/profile-block/profile-block";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [{ title: "Profile", link: "/dashboard/profile" }];

export default function ProfilePage() {
  return (
    <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-175px)]"
          title="Profile"
          description="Manage your profile settings"
        />
      </div>
      <Separator />
      <ProfileBlock />
    </div>
  );
}
