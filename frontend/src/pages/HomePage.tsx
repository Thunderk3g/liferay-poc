import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentField {
  name: string;
  label: string;
  value?: string;
  stringValue?: string;
  numberValue?: number;
}

interface StructuredContent {
  id: number;
  title: string;
  description?: string;
  friendlyUrlPath?: string;
  contentFields?: ContentField[];
  dateCreated?: string;
  dateModified?: string;
  taxonomyCategoryBriefs?: any[];
}

interface ApiResponse {
  items: StructuredContent[];
  pageSize: number;
  totalCount: number;
}

// Helper to get field value from contentFields
const getFieldValue = (fields: ContentField[] | undefined, fieldName: string): string => {
  if (!fields) return '';
  const field = fields.find(f => f.name === fieldName || f.label === fieldName);
  return field?.stringValue || field?.value || '';
};

export function HomePage() {
  const [pageContent, setPageContent] = useState<StructuredContent | null>(null);
  const [contentItems, setContentItems] = useState<StructuredContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Basic Auth with Liferay credentials
        const auth = btoa('test@liferay.com:test');

        // Fetch all structured content from Liferay via proxy
        const response = await axios.get<ApiResponse>(
          '/o/headless-delivery/v1.0/sites/33815/structured-contents?pageSize=100',
          { 
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const items = response.data.items || [];
        setContentItems(items);

        // Set first item as page content (or find homepage)
        if (items.length > 0) {
          const homePage = items.find(
            item => item.title?.toLowerCase().includes('home') ||
                     item.friendlyUrlPath?.toLowerCase().includes('home')
          ) || items[0];
          setPageContent(homePage);
        }

        if (items.length === 0) {
          setError('No content found. Create structured content in Liferay with the following fields: title, description, content, imageUrl, link, linkText');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError('Authentication failed. Check Liferay credentials.');
          } else if (err.response?.status === 404) {
            setError('API endpoint not found. Check Liferay configuration.');
          } else if (err.response?.status === 0) {
            setError('Cannot connect to Liferay. Ensure it\'s running at http://localhost:8080');
          } else {
            setError(`Error: ${err.response?.status} - ${err.response?.statusText}`);
          }
        } else {
          setError('Failed to fetch content from Liferay');
        }
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleTabClick = (item: StructuredContent) => {
    setPageContent(item);
    setActiveTab(item.id.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Content Managed */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Liferay Powered Content Hub
          </h1>
          <p className="text-lg text-slate-600">
            All content is managed through Liferay CMS
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs - Content Managed */}
        {contentItems.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="flex overflow-x-auto">
              {contentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === item.id.toString()
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area - Fully Content Managed */}
        {pageContent && (
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {pageContent.title}
              </h2>
              <p className="text-slate-600">
                {pageContent.description}
              </p>
            </div>

            {/* Hero Image - Content Managed */}
            {getFieldValue(pageContent.contentFields, 'imageUrl') && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={getFieldValue(pageContent.contentFields, 'imageUrl')}
                  alt={pageContent.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Main Content - Content Managed */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Managed in Liferay CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {getFieldValue(pageContent.contentFields, 'content') ||
                    getFieldValue(pageContent.contentFields, 'Body') ||
                    'No content available'}
                </div>
              </CardContent>
            </Card>

            {/* CTA Button - Content Managed */}
            {getFieldValue(pageContent.contentFields, 'link') && (
              <div className="flex gap-4">
                <a
                  href={getFieldValue(pageContent.contentFields, 'link')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {getFieldValue(pageContent.contentFields, 'linkText') || 'Learn More'}
                </a>
                <a
                  href="http://localhost:8080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Edit in Liferay
                </a>
              </div>
            )}

            {/* Metadata - Content Managed */}
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm">Content Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Content ID:</span>
                  <p className="font-mono text-slate-900">{pageContent.id}</p>
                </div>
                <div>
                  <span className="text-slate-600">Created:</span>
                  <p className="text-slate-900">
                    {pageContent.dateCreated
                      ? new Date(pageContent.dateCreated).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Modified:</span>
                  <p className="text-slate-900">
                    {pageContent.dateModified
                      ? new Date(pageContent.dateModified).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Friendly URL:</span>
                  <p className="font-mono text-slate-900 truncate">
                    {pageContent.friendlyUrlPath || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Fields Display */}
            {pageContent.contentFields && pageContent.contentFields.length > 0 && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm">Content Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {pageContent.contentFields.map((field, idx) => (
                      field.label && (field.stringValue || field.value) && (
                        <div key={idx} className="p-3 bg-slate-50 rounded">
                          <p className="text-xs font-semibold text-slate-600 uppercase">
                            {field.label}
                          </p>
                          <p className="text-slate-900 mt-1">
                            {field.stringValue || field.value}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {contentItems.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Content Available
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create structured content in Liferay to see it displayed here. 
                Add fields like: title, description, content, imageUrl, link, linkText
              </p>
              <div className="space-y-2">
                <p className="text-sm text-slate-500 mb-4">
                  Frontend will automatically sync with Liferay CMS
                </p>
                <a
                  href="http://localhost:8080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Liferay Admin
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Content Management Architecture
          </h3>
          <ul className="space-y-2 text-slate-700 text-sm">
            <li>✓ <strong>100% Content-Managed:</strong> All pages and content controlled by Liferay CMS</li>
            <li>✓ <strong>Dynamic Pages:</strong> Create new pages in Liferay, frontend auto-syncs</li>
            <li>✓ <strong>Real-time Updates:</strong> Changes in Liferay appear instantly on frontend</li>
            <li>✓ <strong>No Code Changes:</strong> Update content without touching frontend code</li>
            <li>✓ <strong>Structured Content:</strong> Use Liferay structured content types for consistency</li>
            <li>✓ <strong>Docker Isolated:</strong> All running inside Docker, no external dependencies</li>
          </ul>
          <div className="mt-4 p-4 bg-white rounded border border-blue-100">
            <p className="text-xs text-slate-600 mb-2">
              <strong>Recommended Structured Content Fields:</strong>
            </p>
            <code className="text-xs text-slate-900 block font-mono p-2 bg-slate-100 rounded">
title | description | content | imageUrl | link | linkText
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
