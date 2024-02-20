"use client";

import { Icons } from "../icons";

type Props = {
  showPassword: boolean;
  onClick: () => void;
};

export const ShowPasswordBlock = ({ showPassword, onClick }: Props) => {
  return (
    <div
      className="absolute bottom-[8px] right-[13px] w-5 h-5 cursor-pointer"
      onClick={onClick}
    >
      {showPassword ? (
        <Icons.eyeOff className="w-full h-full text-muted-foreground" />
      ) : (
        <Icons.eye className="w-full h-full text-muted-foreground" />
      )}
    </div>
  );
};
