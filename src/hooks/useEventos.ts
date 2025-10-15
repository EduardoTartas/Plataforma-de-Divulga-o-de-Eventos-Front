import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { EventosApiResponse } from "@/types/eventos";

// Token temporário chumbado (substituir quando implementar auth)
const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWZmODEyY2EzY2I5NTZiOTQyNjhmZiIsImlhdCI6MTc2MDU1NzE4NiwiZXhwIjoxNzYwNTU4MDg2fQ.nEGmGQUI4ZvpVVS-yuTNAPwNQbFuE5fLE-9iFkMhdxc"; // <- Coloque seu token de teste aqui

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
        `/eventos/?page=${page}&limite=${limit}`,
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
  return async (eventId: string, newStatus: number, token: string = TEMP_TOKEN) => {
    return fetchData(
      `/eventos/${eventId}`,
      "PATCH",
      token,
      { status: newStatus }
    );
  };
}

export function useDeleteEvent() {
  return async (eventId: string, token: string = TEMP_TOKEN) => {
    return fetchData(
      `/eventos/${eventId}`,
      "DELETE",
      token
    );
  };
}
