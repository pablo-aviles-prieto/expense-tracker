"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { DEFAULT_CALLBACK_URL } from "@/utils/const";

type Props = {
  callbackUrl: string;
};

export default function GoogleSignInButton({ callbackUrl }: Props) {
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn("google", { callbackUrl: callbackUrl ?? DEFAULT_CALLBACK_URL })
      }
    >
      <Icons.google className="w-4 h-4 mr-2" />
      Continue with Google
    </Button>
  );
}
