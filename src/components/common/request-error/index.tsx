import { Icon } from "@/components";
import { Button, Card, CardContent } from "@/components/ui";
import Image from "next/image";

type Props = {
  refetch: () => void;
  message?: string;
};

export function RequestError({ refetch, message }: Props) {
  return (
    <Card className="p-8">
      <CardContent className="space-y-6 flex flex-col items-center justify-center">
        <Image
          src="/error-req.svg"
          alt="Error request"
          width={250}
          height={250}
          priority
        />
        <h2 className="text-xl font-semibold text-gray-600">
          {message
            ? message
            : "Ocorreu um erro ao carregar os dados do servidor."}
        </h2>
        <Button
          className="bg-gray-100 w-max px-4 hover:bg-gray-50 transition-colors text-gray-600"
          onClick={() => refetch()}
        >
          <Icon name="RefreshCcw" size={20} />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
