"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

// Tipo utilitário para data-testid e data-test
interface TestableProps {
  "data-testid"?: string;
  "data-test"?: string;
}

function Label({
  className,
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & TestableProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
