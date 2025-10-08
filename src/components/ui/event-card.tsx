import { Evento } from "@/types/eventos";

interface EventCardProps {
  evento: Evento;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onToggleStatus?: (eventId: string, currentStatus: number) => void;
}

export default function EventCard({ evento, onEdit, onDelete, onToggleStatus }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar a hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para determinar o status do evento baseado na data e status
  const getEventStatus = () => {
    const now = new Date();
    const dataInicio = new Date(evento.dataInicio);
    const dataFim = new Date(evento.dataFim);

    // Se o status do evento foi definido como inativo (0), sempre será inativo
    if (evento.status === 0) {
      return {
        text: 'Inativo',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }

    // Se o evento já passou (data fim menor que agora)
    if (dataFim < now) {
      return {
        text: 'Inativo',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }

    // Se o evento está acontecendo agora (entre data início e data fim)
    if (dataInicio <= now && now <= dataFim) {
      return {
        text: 'Ativo',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    }

    // Se o evento está ativo mas ainda vai acontecer (data início maior que agora)
    if (evento.status === 1 && dataInicio > now) {
      return {
        text: 'Em breve',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }

    // Status padrão
    return {
      text: 'Rascunho',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };

  const statusInfo = getEventStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Imagem do evento */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={evento.midia && evento.midia.length > 0 ? evento.midia[0] : "/img_principal.png"} 
          alt={evento.titulo}
          className="w-full h-full object-cover"
        />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 font-inter">
          {evento.titulo}
        </h3>

        {/* Data e hora */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {formatDate(evento.dataInicio)} às {formatTime(evento.dataInicio)}
          </span>
        </div>

        {/* Local */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{evento.local}</span>
        </div>

        {/* Ações */}
        <div className="flex justify-end items-center space-x-3">
          {/* Toggle Status */}
          {onToggleStatus && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 font-medium">
                {evento.status === 1 ? 'Ativo' : 'Inativo'}
              </span>
              <button
                onClick={() => onToggleStatus(evento._id, evento.status)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  evento.status === 1 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
                title={evento.status === 1 ? 'Desativar evento' : 'Ativar evento'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    evento.status === 1 ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(evento._id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Editar evento"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(evento._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Excluir evento"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}