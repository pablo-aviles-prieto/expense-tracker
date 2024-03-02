import { getEllipsed } from "@/utils/const";

interface HeadingProps {
  title: string;
  description: string;
  maxWidthClass?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  maxWidthClass = "",
}) => {
  return (
    <div className={maxWidthClass}>
      <h2 className="text-xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className={`text-sm text-muted-foreground ${getEllipsed}`}>
        {description}
      </p>
    </div>
  );
};
