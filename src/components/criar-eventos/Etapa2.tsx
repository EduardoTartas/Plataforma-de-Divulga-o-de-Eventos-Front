"use client";

interface Etapa2UploadImagensProps {
  validImages: File[];
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function Etapa2UploadImagens({
  validImages,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
  onRemoveImage,
}: Etapa2UploadImagensProps) {
  return (
    <>
      {/* Step 2: Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A202C] flex items-center gap-2">
              <svg className="w-6 h-6 text-[#805AD5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Imagens do Evento
            </h2>
            <p className="text-sm text-[#718096] mt-1">
              Resolução mínima: <strong>1280x720 pixels</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
            <span className="text-sm font-semibold text-[#805AD5]">{validImages.length}/6</span>
            <span className="text-xs text-[#6B46C1]">imagens</span>
          </div>
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? "border-[#805AD5] bg-purple-50 scale-[1.02]"
              : "border-[#E2E8F0] bg-gray-50 hover:border-[#805AD5] hover:bg-purple-50"
          }`}
        >
          <input
            id="fileUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={onFileInputChange}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className={`p-4 rounded-full mb-4 transition-all ${
              isDragging 
                ? "bg-[#805AD5] scale-110" 
                : "bg-purple-100"
            }`}>
              <svg
                className={`w-12 h-12 transition-colors ${
                  isDragging ? "text-white" : "text-[#805AD5]"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <span className="text-base text-[#2D3748] mb-2 font-semibold">
              {isDragging ? "Solte as imagens aqui!" : "Arraste e solte suas imagens"}
            </span>
            <span className="text-sm text-[#718096] mb-3">ou</span>
            <span className="px-6 py-2.5 bg-[#805AD5] hover:bg-[#6B46C1] text-white rounded-lg font-medium transition-colors shadow-sm">
              Selecionar Arquivos
            </span>
            <span className="text-xs text-[#A0AEC0] mt-4">PNG, JPG, JPEG (máx. 6 imagens)</span>
          </label>
        </div>

        {validImages.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4 max-h-[200px] overflow-y-auto scrollbar-thin">
            {validImages.map((file, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#E2E8F0]">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 font-bold shadow-md"
                  title="Remover imagem"
                >
                  ×
                </button>
                <p className="text-xs text-[#718096] px-2 py-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
