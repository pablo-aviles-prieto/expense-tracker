import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Image
        src="/images/logo.webp"
        alt="Expense tracker logo"
        width={45}
        height={45}
      />
      <div>
        <p>Login</p>
        <p>Register</p>
      </div>
    </header>
  );
};
