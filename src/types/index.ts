import type { Category, Link, User, Vote, Report, Comment, BrandRequest, WaitlistEntry } from "@prisma/client";

// Extended types with relations
export type LinkWithRelations = Link & {
  category: Category;
  votes: Vote[];
  reports: Report[];
  comments: Comment[];
  _count?: {
    votes: number;
    comments: number;
  };
};

export type CategoryWithLinks = Category & {
  links: LinkWithRelations[];
  _count?: {
    links: number;
  };
};

export type UserPublic = Pick<User, "id" | "name" | "image" | "role" | "membershipTier">;

// API response shapes
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

// Nav items
export type NavItem = {
  label: string;
  href: string;
  icon?: string;
};

// Seed data shape
export type SeedCategory = {
  name: string;
  slug: string;
  links: Array<{
    brandName: string;
    url: string;
    headline?: string;
  }>;
};

// Admin types
export type BrandRequestWithRelations = BrandRequest & {
  user: Pick<User, "name" | "email" | "membershipTier">;
  category: Pick<Category, "name">;
};

export type WaitlistEntryWithRelations = WaitlistEntry & {
  user: Pick<User, "name" | "email" | "membershipTier">;
  link: Pick<Link, "brandName" | "url">;
};
