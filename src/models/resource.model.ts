export interface ResourceBundle {
  items: Resource[];
}

export interface BasicDetails {
  title: string;
  description: string;
  tags: string[];
}

export interface AuthorDetails {
  author: Author;
}

export interface Author {
  username: string;
  github: string;
  twitter: string;
  web: string;
}

export interface Resource extends BasicDetails, AuthorDetails {
  guid: string;
}

/**
 * Represents a 3D model resource
 */
export interface ModelResource extends Resource {}