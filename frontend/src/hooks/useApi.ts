import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from '../lib/api';
import type { Guest, Contribution, Stats, CreateGuestInput, CreateContributionInput, Category } from '../types';

// Types de réponse API
interface GuestsResponse {
  success: boolean;
  data: Guest[];
  total: number;
}

interface ContributionsResponse {
  success: boolean;
  data: Record<Category, (Contribution & { guest: Pick<Guest, 'id' | 'firstName' | 'lastName'> })[]>;
  stats: {
    totalContributions: number;
    totalServings: number;
    byCategory: Record<Category, { count: number; servings: number }>;
  };
}

interface StatsResponse {
  success: boolean;
  data: Stats;
}

// Hook pour récupérer les participants
export function useGuests() {
  return useQuery({
    queryKey: ['guests'],
    queryFn: () => fetchAPI<GuestsResponse>('/api/guests'),
  });
}

// Hook pour récupérer les contributions
export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: () => fetchAPI<ContributionsResponse>('/api/contributions'),
  });
}

// Hook pour récupérer les statistiques
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchAPI<StatsResponse>('/api/stats'),
  });
}

// Hook pour créer un participant
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuestInput) =>
      fetchAPI<{ success: boolean; data: Guest }>('/api/guests', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Hook pour modifier un participant
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGuestInput> }) =>
      fetchAPI<{ success: boolean; data: Guest }>(`/api/guests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
}

// Hook pour supprimer un participant
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchAPI<{ success: boolean }>(`/api/guests/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Hook pour créer une contribution
export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContributionInput) =>
      fetchAPI<{ success: boolean; data: Contribution }>('/api/contributions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Hook pour modifier une contribution
export function useUpdateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<CreateContributionInput, 'guestId'>> }) =>
      fetchAPI<{ success: boolean; data: Contribution }>(`/api/contributions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Hook pour supprimer une contribution
export function useDeleteContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchAPI<{ success: boolean }>(`/api/contributions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
