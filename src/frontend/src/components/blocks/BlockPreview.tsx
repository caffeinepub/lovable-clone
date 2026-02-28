import type {
  BlockType,
  HeroContent,
  TextContent,
  ImageContent,
  ButtonContent,
  ColumnsContent,
  FooterContent,
} from "../../types/blocks";
import { parseBlockContent } from "../../types/blocks";

interface BlockPreviewProps {
  blockType: BlockType;
  content: string;
}

function HeroPreview({ content }: { content: HeroContent }) {
  return (
    <div
      className="relative w-full min-h-[320px] flex items-center justify-center overflow-hidden"
      style={{
        background: content.backgroundImage
          ? `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${content.backgroundImage}) center/cover`
          : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <div className="text-center px-8 py-16 max-w-3xl">
        <h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {content.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8">
          {content.subheadline}
        </p>
        {content.buttonLabel && (
          <a
            href={content.buttonUrl || "#"}
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-full transition-colors text-base"
          >
            {content.buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function TextPreview({ content }: { content: TextContent }) {
  return (
    <div className="w-full py-16 px-8 md:px-16 bg-white">
      <div className="max-w-3xl mx-auto">
        {content.heading && (
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {content.heading}
          </h2>
        )}
        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
          {content.body}
        </p>
      </div>
    </div>
  );
}

function ImagePreview({ content }: { content: ImageContent }) {
  return (
    <div className="w-full bg-gray-50 py-8">
      {content.src ? (
        <figure className="max-w-4xl mx-auto px-8">
          <img
            src={content.src}
            alt={content.alt || ""}
            className="w-full rounded-lg shadow-lg object-cover"
          />
          {content.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              {content.caption}
            </figcaption>
          )}
        </figure>
      ) : (
        <div className="max-w-4xl mx-auto px-8 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm">No image URL provided</p>
        </div>
      )}
    </div>
  );
}

function ButtonPreview({ content }: { content: ButtonContent }) {
  const variantStyles = {
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-white font-semibold",
    outline:
      "border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-semibold",
  };

  return (
    <div className="w-full py-12 px-8 bg-white flex justify-center">
      <a
        href={content.url || "#"}
        className={`inline-block px-8 py-3 rounded-full transition-colors text-base ${variantStyles[content.variant || "primary"]}`}
      >
        {content.label}
      </a>
    </div>
  );
}

function ColumnsPreview({ content }: { content: ColumnsContent }) {
  return (
    <div className="w-full py-16 px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {content.leftHeading}
          </h3>
          <p className="text-gray-600 leading-relaxed">{content.leftBody}</p>
        </div>
        <div>
          <h3
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {content.rightHeading}
          </h3>
          <p className="text-gray-600 leading-relaxed">{content.rightBody}</p>
        </div>
      </div>
    </div>
  );
}

function FooterPreview({ content }: { content: FooterContent }) {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {content.companyName}
          </h3>
          {content.tagline && (
            <p className="text-gray-400">{content.tagline}</p>
          )}
        </div>
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-500 text-sm">{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export function BlockPreview({ blockType, content }: BlockPreviewProps) {
  switch (blockType) {
    case "hero":
      return (
        <HeroPreview
          content={parseBlockContent<HeroContent>(content, "hero")}
        />
      );
    case "text":
      return (
        <TextPreview
          content={parseBlockContent<TextContent>(content, "text")}
        />
      );
    case "image":
      return (
        <ImagePreview
          content={parseBlockContent<ImageContent>(content, "image")}
        />
      );
    case "button":
      return (
        <ButtonPreview
          content={parseBlockContent<ButtonContent>(content, "button")}
        />
      );
    case "columns":
      return (
        <ColumnsPreview
          content={parseBlockContent<ColumnsContent>(content, "columns")}
        />
      );
    case "footer":
      return (
        <FooterPreview
          content={parseBlockContent<FooterContent>(content, "footer")}
        />
      );
    default:
      return (
        <div className="w-full p-8 bg-gray-100 text-gray-400 text-center">
          Unknown block type
        </div>
      );
  }
}
