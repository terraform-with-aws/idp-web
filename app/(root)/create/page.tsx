import { CreateEnvironmentForm } from '@/components/environment-form';
import React from 'react';

export default function CreatePage() {
  return (
    <div className="flex items-center justify-center">
      <div className=" shadow-md rounded-lg p-8 max-w-lg w-full border">
        <h1 className="text-3xl font-bold text-center mb-6">Create Environment</h1>
        <p className="text-center text-gray-600 mb-8">
          Fill in the details below to create a new environment.
        </p>
        <CreateEnvironmentForm />
      </div>
    </div>
  );
}
