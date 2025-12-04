import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LiferayStructuredContent } from "@/types/liferay";

interface ContentCardProps {
  content: LiferayStructuredContent;
}

export function ContentCard({ content }: ContentCardProps) {
  // Extract HTML content from content fields
  const getContentHTML = (): string => {
    const contentField = content.contentFields.find(
      (field) => field.name === "content" || field.dataType === "html"
    );
    return contentField?.contentFieldValue?.data || "<p>No content available</p>";
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{content.title || "Untitled"}</CardTitle>
        <CardDescription>
          {content.creator?.name && (
            <span className="font-medium">By {content.creator.name}</span>
          )}
          {content.dateModified && (
            <span className="text-xs block mt-1">
              Last updated: {formatDate(content.dateModified)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: getContentHTML() }}
        />
      </CardContent>
    </Card>
  );
}
