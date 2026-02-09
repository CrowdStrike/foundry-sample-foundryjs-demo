import { CloudFunctionDemo } from '../components/cloud-function-demo.tsx';

export function CloudFunctions() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-basement min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-titles-and-attributes mb-2">Cloud Functions Demo</h1>
        <p className="text-body-and-labels">
          Execute Cloud Functions with different HTTP methods and handle responses.
        </p>
      </div>
      <CloudFunctionDemo />
    </div>
  );
}