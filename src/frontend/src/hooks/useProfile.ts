import { createActor } from "@/backend";
import type { StudentProfile } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<StudentProfile | null>({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveStudentProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: actorFetching || query.isLoading,
    isError: query.isError,
    error: query.error,
    saveProfile: mutation.mutate,
    saveProfileAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
