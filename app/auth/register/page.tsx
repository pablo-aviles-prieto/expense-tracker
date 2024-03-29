import { RegisterUserBlock } from "@/components/register-user-block/register-user-block";
import { verifyRegisterToken } from "@/services/user";
import { errorMessages } from "@/utils/const";

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

const decodedToken = async (token: string) => {
  try {
    const decodedTkn = await verifyRegisterToken(token);
    return decodedTkn
      ? { data: decodedTkn, errorMessage: null }
      : { errorMessage: errorMessages.registerTokenExpired };
  } catch (err) {
    return { errorMessage: errorMessages.registerTokenExpired };
  }
};

export default async function AuthenticationPage({
  searchParams,
}: ParamsProps) {
  const { token } = searchParams;
  const decodedTkn = await decodedToken(token ?? "");

  return <RegisterUserBlock decodedToken={decodedTkn} />;
}
