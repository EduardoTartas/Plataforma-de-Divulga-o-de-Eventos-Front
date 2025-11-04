"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

// Tipo utilitário para data-testid e data-test
interface TestableProps extends React.HTMLAttributes<HTMLElement> {
  "data-testid"?: string;
  "data-test"?: string;
}

// ---- Pagination ----
function Pagination({
  className,
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: React.ComponentProps<"nav"> & TestableProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: React.ComponentProps<"ul"> & TestableProps) {
  return (
    <ul
      data-slot="pagination-content"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: React.ComponentProps<"li"> & TestableProps) {
  return <li data-slot="pagination-item" data-test={dataTest} data-testid={dataTestId} {...props} />;
}

// ---- PaginationLink ----
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a"> &
  TestableProps;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-test={dataTest}
      data-testid={dataTestId}
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

// ---- PaginationPrevious ----
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

// ---- PaginationNext ----
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

// ---- PaginationEllipsis ----
function PaginationEllipsis({
  className,
  "data-testid": dataTestId,
  "data-test": dataTest,
  ...props
}: React.ComponentProps<"span"> & TestableProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      data-test={dataTest}
      data-testid={dataTestId}
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
