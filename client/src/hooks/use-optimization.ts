import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { OptimizeRequest, OptimizeResponse } from "@/types";
import { addToHistory } from "@/lib/storage";

export const useOptimization = (options: {
  onSuccess?: (data: OptimizeResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const optimizeMutation = useMutation({
    mutationFn: async (request: OptimizeRequest) => {
      const response = await apiRequest("POST", "/api/optimize", request);
      return response.json() as Promise<OptimizeResponse>;
    },
    onSuccess: (data) => {
      setResult(data.optimizedText);
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      if (options.onError) {
        options.onError(error);
      }
    },
    onSettled: () => {
      setIsOptimizing(false);
    }
  });

  const optimize = async (request: OptimizeRequest) => {
    setIsOptimizing(true);
    optimizeMutation.mutate(request);
  };

  return {
    optimize,
    isOptimizing: optimizeMutation.isPending,
    result,
    error: optimizeMutation.error,
  };
};
