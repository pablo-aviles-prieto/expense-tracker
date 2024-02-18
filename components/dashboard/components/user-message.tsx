import { Session } from "next-auth";

type Props = {
  session: Session | null;
};

export const UserMessage = ({ session }: Props) => {
  return (
    <h2 className="text-3xl font-bold tracking-tight">
      Hi, Welcome back{" "}
      <span className="text-muted-foreground">{session?.user?.name}</span> 👋
    </h2>
  );
};
