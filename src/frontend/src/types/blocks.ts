export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "button"
  | "columns"
  | "footer";

export interface HeroContent {
  headline: string;
  subheadline: string;
  buttonLabel: string;
  buttonUrl: string;
  backgroundImage: string;
}

export interface TextContent {
  heading: string;
  body: string;
}

export interface ImageContent {
  src: string;
  alt: string;
  caption: string;
}

export interface ButtonContent {
  label: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
}

export interface ColumnsContent {
  leftHeading: string;
  leftBody: string;
  rightHeading: string;
  rightBody: string;
}

export interface FooterContent {
  companyName: string;
  tagline: string;
  copyright: string;
}

export type BlockContent =
  | HeroContent
  | TextContent
  | ImageContent
  | ButtonContent
  | ColumnsContent
  | FooterContent;

export const DEFAULT_BLOCK_CONTENT: Record<BlockType, BlockContent> = {
  hero: {
    headline: "Welcome to My Website",
    subheadline: "Built with WebCraft — the fastest way to create stunning sites",
    buttonLabel: "Get Started",
    buttonUrl: "#",
    backgroundImage: "",
  } as HeroContent,
  text: {
    heading: "About Us",
    body: "We're a team passionate about building great products. Our mission is to make the web more beautiful, one site at a time.",
  } as TextContent,
  image: {
    src: "",
    alt: "Image",
    caption: "",
  } as ImageContent,
  button: {
    label: "Click Me",
    url: "#",
    variant: "primary",
  } as ButtonContent,
  columns: {
    leftHeading: "Feature One",
    leftBody: "A powerful capability that sets you apart from the competition.",
    rightHeading: "Feature Two",
    rightBody: "Another incredible feature that your customers will love.",
  } as ColumnsContent,
  footer: {
    companyName: "My Company",
    tagline: "Making the world better, one step at a time.",
    copyright: `© ${new Date().getFullYear()} My Company. All rights reserved.`,
  } as FooterContent,
};

export function parseBlockContent<T extends BlockContent>(
  content: string,
  blockType: BlockType
): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    return DEFAULT_BLOCK_CONTENT[blockType] as T;
  }
}

export interface BlockLibraryItem {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
}

export const BLOCK_LIBRARY: BlockLibraryItem[] = [
  {
    type: "hero",
    label: "Hero",
    description: "Full-width banner with headline & CTA",
    icon: "Sparkles",
  },
  {
    type: "text",
    label: "Text",
    description: "Rich text paragraph section",
    icon: "AlignLeft",
  },
  {
    type: "image",
    label: "Image",
    description: "Full-width or contained image",
    icon: "Image",
  },
  {
    type: "button",
    label: "Button",
    description: "CTA button",
    icon: "MousePointerClick",
  },
  {
    type: "columns",
    label: "Columns",
    description: "Two-column layout",
    icon: "Columns2",
  },
  {
    type: "footer",
    label: "Footer",
    description: "Page footer with links",
    icon: "PanelBottom",
  },
];
