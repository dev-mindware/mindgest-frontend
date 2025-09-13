import { Separator } from "@/components/ui";

interface TitleListProps {
  title: string;
  suTitle?: string;
  separator?: boolean;
}

export function TitleList({ title, suTitle, separator }: TitleListProps) {
  return (
    <>
      <div>
        <h2 className="text-2xl text-start md:text-start">{title}</h2>
        {suTitle && (
          <p className="text-start text-muted-foreground sm:text-start">
            {suTitle}
          </p>
        )}
      </div>
      {separator && <Separator />}
    </>
  );
}
