import { Construction } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader className="text-center py-16">
          <Construction className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <CardTitle className="text-lg">Em construcao</CardTitle>
          <CardDescription>
            Este modulo sera implementado em breve
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
