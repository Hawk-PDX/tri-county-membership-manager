import PageContainer from './PageContainer';

export default function DynamicPage({ title, subtitle, content }) {
  return (
    <PageContainer title={title} subtitle={subtitle}>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          {content || (
            <p className="text-gray-600">
              Page content coming soon.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
