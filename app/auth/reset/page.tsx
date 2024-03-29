import { verifyRecoveryToken } from "@/services/user";
import { redirect } from "next/navigation";

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function AuthenticationPage({
  searchParams,
}: ParamsProps) {
  const { token } = searchParams;

  const decodedToken = await verifyRecoveryToken(token ?? "");

  // TODO: The user may try to recover the password into an account that doesnt have
  // a password stored since it was created by the google provider, so it could add
  // a password to it.
  if (!decodedToken) {
    redirect("/auth");
  }

  return <div>Reset password</div>;
}
