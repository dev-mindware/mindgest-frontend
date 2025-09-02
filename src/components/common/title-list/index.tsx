import { Separator } from "@/components/ui";

interface TitleListProps {
  title: string;
  suTitle?: string;
}

export function TitleList({ title, suTitle }: TitleListProps) {
  return (
    <>
      <div>
        <h2 className="text-2xl text-center md:text-start">{title}</h2>
        <p className="text-center text-muted-foreground md:text-start">
          {suTitle}
        </p>
      </div>
      <Separator />
    </>
  );
}
