import * as React from "react";
import { cn } from "@/lib/utils";

// Interface comum para todos os subcomponentes do Card
interface TestableDivProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-testid"?: string;
  "data-test"?: string;
}

function Card({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== "data-test" && key !== "data-testid")
      )}
    />
  );
}

function CardHeader({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-header"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-title"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-description"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-action"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-content"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, "data-testid": dataTestId, "data-test": dataTest, ...props }: TestableDivProps) {
  return (
    <div
      data-slot="card-footer"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
