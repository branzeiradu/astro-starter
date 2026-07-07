// src/types/contentful.d.ts
export interface ContentfulSys {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientModel {
  // __typename?: "ClientModel";
  // sys: ContentfulSys;
  clientName: string;
  clientExternalLink: string;
  clientLogo: ClientLogo;
}

export interface ClientLogo {
  // __typename?: "ClientModel";
  // sys: ContentfulSys;
  title: string;
  url: string;
}

export interface ProjectsNewsBlogPost {
  postTitle: string;
  dateDisplayed: string; // expecting a date string format
  postIntroduction: string;
}

export interface FeaturedProjectsCollection {
  items: ProjectsNewsBlogPost[];
}

// Group your collections for cleaner page-level fetching types
export interface OurClientsCollection {
  items: ClientModel[];
}

export interface ContentfulGraphQLResponse {
  ourClientsCollection: OurClientsCollection;
}