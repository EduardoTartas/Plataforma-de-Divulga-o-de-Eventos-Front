"use client"

import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Usuario, UsuarioApi } from "@/types/eventos"
import { useState, useEffect } from "react"
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { Erro } from '@/types/eventos'
import { fetchData } from "@/services/api"

export default function AdministrativoPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(true)
    const [erroUsuarios, setErroUsuarios] = useState<string | null>(null)

    const alterarStatus = async (id: string) => {
        try {
            let resposta = fetchData(`/usuarios/${id}/status`, 'PATCH')
        } catch (error) {
            alert(`Não foi possivel alterar o status do Usuário: ${error}`)
        }
    }

    async function buscarUsuarios() {
        try {
            setCarregandoUsuarios(true);
            setErroUsuarios(null);
            const resposta = await fetchData<UsuarioApi>('/usuarios', 'GET');

            if (resposta.code !== 200) {
                throw new Error('Erro ao buscar usuários');
            }
            const dadosUsuarios = resposta.data
            if (!dadosUsuarios) {
                setUsuarios([]);
            } else if (Array.isArray(dadosUsuarios)) {
                setUsuarios(dadosUsuarios);
            } else {
                setUsuarios([dadosUsuarios]);
            }
        } catch (erro) {
            console.error('Erro ao buscar Usuarios:', erro);
            setErroUsuarios(erro instanceof Error ? erro.message : 'Erro desconhecido')
            setUsuarios([]);
        } finally {
            setCarregandoUsuarios(false);
        }
    }

    useEffect(() => {
        buscarUsuarios();
    }, [])

    return (
        <div className="font-inter min-h-screen bg-[#F9FAFB]">
            {/* Banner Hero */}
            <div className="relative overflow-hidden bg-indigo-700">
                <div className="container mx-auto px-6 py-12 lg:py-16 relative z-10">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white font-inter mb-4">
                            Gerenciamento de Usuários
                        </h1>
                        <p className="text-lg text-white/90 font-inter leading-relaxed">
                            Visualize e gerencie todos os usuários cadastrados na plataforma.
                        </p>
                    </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full"></div>
                <div className="absolute bottom-20 right-32 w-40 h-40 bg-gradient-to-tl from-purple-300/15 to-transparent rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-r from-blue-300/20 to-transparent rounded-full"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-bl from-yellow-300/15 to-transparent rounded-full"></div>
            </div>

            {/* Conteúdo Principal */}
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header da Tabela */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Lista de Usuários
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {carregandoUsuarios ? 'Carregando...' : `${usuarios.length} usuário(s) cadastrado(s)`}
                        </p>
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-gray-700 font-semibold">ID</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Nome</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">E-mail</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Criado Em</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                                    <TableHead className="text-gray-700 font-semibold text-center">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {carregandoUsuarios ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                                                <span className="text-gray-600">Carregando usuários...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : erroUsuarios ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                                                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                                                        Erro ao carregar usuários
                                                    </h3>
                                                    <p className="text-red-600 text-sm">{erroUsuarios}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : usuarios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usuarios.map((usuario, index) => (
                                        <TableRow
                                            key={usuario._id}
                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                                        >
                                            <TableCell className="text-gray-600 font-mono text-xs">
                                                {usuario._id.slice(-8)}
                                            </TableCell>
                                            <TableCell className="text-gray-900 font-medium">
                                                {usuario.nome}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {usuario.email}
                                            </TableCell>
                                            <TableCell className="text-gray-600 text-sm">
                                                {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.status === 'ativo'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {usuario.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        className="transition-transform hover:scale-110 cursor-pointer"
                                                        title={usuario.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                                                        onClick={() => alterarStatus(usuario._id)}
                                                    >
                                                        {usuario.status === 'ativo' ? (
                                                            <ToggleRight className="text-green-600 w-5 h-5" />
                                                        ) : (
                                                            <ToggleLeft className="text-gray-400 w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        className="transition-transform hover:scale-110 cursor-pointer"
                                                        title="Excluir usuário"
                                                    >
                                                        <Trash2 className="text-red-600 w-5 h-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}