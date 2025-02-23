'use client';

import EnvironmentCard, { EnvironmentStatus } from "@/components/environment-card";
import { useGetEnvironments } from "@/hooks/use-environment-hook";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";

export interface Environment {
  environment: string;
  stack: string;
  status: EnvironmentStatus;
  owner: string;
  config: {
    [key: string]: string; 
  };
  note: string;
}

export default function Home() {
  const { data, isLoading, isError } = useGetEnvironments();

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary dark:text-primary-foreground" />
          <p className="text-lg font-medium dark:text-gray-300">Loading environments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
          <h2 className="text-xl font-semibold dark:text-gray-100">Error Loading Environments</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There was a problem fetching the environment data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const environments = data.data as Environment[];
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-center dark:text-white">
            Environments
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Manage and monitor your deployment environments
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {environments.map((env: Environment) => (
            <EnvironmentCard key={env.environment} env={env} />
          ))}
        </div>

        {environments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No environments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
