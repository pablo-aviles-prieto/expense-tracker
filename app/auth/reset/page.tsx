import { ResetPasswordBlock } from "@/components/reset-password-block/reset-password-block";
import { verifyRecoveryToken } from "@/services/user";
import { errorMessages } from "@/utils/const";

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

const decodedToken = async (token: string) => {
  try {
    const decodedTkn = await verifyRecoveryToken(token);
    return decodedTkn
      ? { data: decodedTkn, errorMessage: null }
      : { errorMessage: errorMessages.resetTokenExpired };
  } catch (err) {
    return { errorMessage: errorMessages.resetTokenExpired };
  }
};

export default async function AuthenticationPage({
  searchParams,
}: ParamsProps) {
  const { token } = searchParams;
  const decodedTkn = await decodedToken(token ?? "");

  return <ResetPasswordBlock decodedToken={decodedTkn} />;
}
