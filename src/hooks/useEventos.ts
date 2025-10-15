import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { EventosApiResponse } from "@/types/eventos";
import { toast } from "react-toastify";

// Token  chumbado
const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWZmOGI1MTA0YWJkM2Q0MzVhNTZjZSIsImlhdCI6MTc2MDU3MjEzNSwiZXhwIjoxNzYwNTczMDM1fQ.TK6wS-nTSur-Y7Y2B11RxxzIl2YBbDMeHKnKGrK5olM";

interface UseEventosParams {
  page: number;
  limit: number;
  enabled?: boolean;
}

export function useEventos({ page, limit, enabled = true }: UseEventosParams) {
  const {
    data: eventosData,
    isLoading: eventosIsLoading,
    isError: eventosIsError,
    error: eventosError,
  } = useQuery<EventosApiResponse, Error>({
    queryKey: ["eventos", page, limit],
    queryFn: async () => {
      return fetchData<EventosApiResponse>(
        `/eventos/?page=${page}&limite=${limit}&ordenarPor=-createdAt`,
        "GET",
        TEMP_TOKEN
      );
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  return {
    data: eventosData,
    isLoading: eventosIsLoading,
    isError: eventosIsError,
    error: eventosError,
  };
}

export function useToggleEventStatus() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: toggleStatusMutate,
    isPending: toggleStatusIsPending,
    isError: toggleStatusIsError,
    error: toggleStatusError,
  } = useMutation({
    mutationFn: async ({ eventId, newStatus }: { eventId: string; newStatus: number }) => {
      return fetchData(
        `/eventos/${eventId}`,
        "PATCH",
        TEMP_TOKEN,
        { status: newStatus }
      );
    },
    onSuccess: (_, variables) => {
      // Invalidar a query de eventos para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      
      // Notificação de sucesso
      const statusText = variables.newStatus === 1 ? "ativado" : "desativado";
      toast.success(`Evento ${statusText} com sucesso!`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do evento. Tente novamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  return {
    toggleStatus: toggleStatusMutate,
    isPending: toggleStatusIsPending,
    isError: toggleStatusIsError,
    error: toggleStatusError,
  };
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteEventMutate,
    isPending: deleteEventIsPending,
    isError: deleteEventIsError,
    error: deleteEventError,
  } = useMutation({
    mutationFn: async (eventId: string) => {
      return fetchData(
        `/eventos/${eventId}`,
        "DELETE",
        TEMP_TOKEN
      );
    },
    onSuccess: () => {
      // Invalidar a query de eventos para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      
      // Notificação de sucesso
      toast.success("Evento excluído com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento. Tente novamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  return {
    deleteEvent: deleteEventMutate,
    isPending: deleteEventIsPending,
    isError: deleteEventIsError,
    error: deleteEventError,
  };
}
