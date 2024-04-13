import { ChangeEmail } from "@/components/change-email-page/change-email-page";
import { verifyChangeMailToken } from "@/services/user";
import { errorMessages } from "@/utils/const";

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

const decodedToken = async (token: string) => {
  try {
    const decodedTkn = await verifyChangeMailToken(token);
    return decodedTkn
      ? { data: decodedTkn, errorMessage: null }
      : { errorMessage: errorMessages.changeEmailTokenExpired };
  } catch (err) {
    return { errorMessage: errorMessages.changeEmailTokenExpired };
  }
};

export default async function ChangeEmailPage({ searchParams }: ParamsProps) {
  const { token } = searchParams;
  const decodedTkn = await decodedToken(token ?? "");

  return <ChangeEmail decodedToken={decodedTkn} />;
}
