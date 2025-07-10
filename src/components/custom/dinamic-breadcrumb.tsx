import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui";

interface Props {
  route?: string;
  subRoute: string;
  showSeparator?: boolean;
}

export function DinamicBreadcrumb({ route, subRoute, showSeparator = true }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">{route}</BreadcrumbLink>
        </BreadcrumbItem>
        {showSeparator && <BreadcrumbSeparator className="hidden md:block" />}
        <BreadcrumbItem>
          <BreadcrumbPage>{subRoute}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
