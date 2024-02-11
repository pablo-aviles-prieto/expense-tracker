import { CustomSessionI } from "@/types";
import { useSession } from "next-auth/react";

export function useCustomSession() {
  const { data, status, update } = useSession();
  const customSession = data as CustomSessionI | null;

  return { data: customSession, status, update };
}
