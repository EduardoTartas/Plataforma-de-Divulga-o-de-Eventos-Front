"use client"

import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Usuario, UsuarioApi } from "@/types/eventos"
import { useState, useEffect } from "react"
import { ToggleLeft, ToggleRight, Trash2, UserPlus, CheckCircle, XCircle } from 'lucide-react'
import { fetchData } from "@/services/api"
import Modal from "@/components/ui/modal"

export default function AdministrativoPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregandoUsuarios, setCarregandoUsuarios] = useState<boolean>(true)
    const [erroUsuarios, setErroUsuarios] = useState<string | null>(null)
    const [atualizandoStatus, setAtualizandoStatus] = useState<string | null>(null)
    const [modalAtivo, setModalAtivo] = useState<string | null>(null)
    const [sucessoModal, setSucessoModal] = useState<boolean>(false)
    const [carregandoModal, setCarregandoModal] = useState<boolean>(false)
    const [erroModal, setErroModal] = useState<string | null>(null)
    const [novoUsuarioNome, setNovoUsuarioNome] = useState<string>('')
    const [novoUsuarioEmail, setNovoUsuarioEmail] = useState<string>('')
    const [novoUsuarioSenha, setNovoUsuarioSenha] = useState<string>('')
    const [confirmarSenha, setConfirmarSenha] = useState<string>('')
    const [senhasCombinam, setSenhasCombinam] = useState<boolean | null>(null)

    const alterarStatus = async (id: string, status: string) => {
        const novoStatus: 'ativo' | 'inativo' = status === 'inativo' ? 'ativo' : 'inativo';

        try {
            setAtualizandoStatus(id);

            setUsuarios(usuarios.map(usuario =>
                usuario._id === id
                    ? { ...usuario, status: novoStatus }
                    : usuario
            ));

            const resposta = await fetchData(`/usuarios/${id}/status`, 'PATCH', undefined, { status: novoStatus });

            if (!resposta || (resposta as any).code !== 200) {
                throw new Error('Erro ao atualizar status');
            }
        } catch (error) {
            // Reverte a mudança em caso de erro
            setUsuarios(usuarios.map(usuario =>
                usuario._id === id
                    ? { ...usuario, status: status as 'ativo' | 'inativo' }
                    : usuario
            ));
            alert(`Não foi possivel alterar o status do Usuário: ${error}`);
        } finally {
            setAtualizandoStatus(null);
        }
    }

    const deletarUsuario = async (id: string) => {
        try {
            const resposta = await fetchData(`/usuarios/${id}`, 'DELETE');

            if (!resposta || (resposta as any).code !== 200) {
                throw new Error('Erro ao deletar usuário');
            }

            // Atualiza a lista de usuários removendo o usuário deletado
            setUsuarios(usuarios.filter(usuario => usuario._id !== id));
        } catch (error) {
            alert(`Não foi possivel deletar o Usuário: ${error}`);

            // Reverte a mudança em caso de erro
            buscarUsuarios();
        }
    }

    const buscarUsuarios = async () => {
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

    const cadastrarUsuario = async () => {
        try {
            setCarregandoModal(true);
            setErroModal(null);
            setSucessoModal(false);

            const resposta = await fetchData<UsuarioApi>('/usuarios', 'POST', undefined, { nome: novoUsuarioNome, email: novoUsuarioEmail, senha: novoUsuarioSenha, status: "ativo" })

            if (resposta.code !== 201) {
                throw new Error('Erro ao cadastrar usuário!');
            }

            setSucessoModal(true);

            // Aguarda 2 segundos e fecha o modal
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Fecha o modal e limpa os estados
            setModalAtivo(null);
            setSucessoModal(false);
            setErroModal(null);

            // Atualiza a lista de usuários
            await buscarUsuarios();
        } catch (erro) {
            console.error('Erro ao cadastrar Usuarios:', erro)
            setErroModal(erro instanceof Error ? erro.message : 'Erro desconhecido')
        } finally {
            setCarregandoModal(false);
        }
    }

    const limparModal = async () => {
        setModalAtivo(null),
            setSucessoModal(false),
            setCarregandoModal(false),
            setErroModal(null),
            setNovoUsuarioNome(''),
            setNovoUsuarioEmail(''),
            setNovoUsuarioSenha(''),
            setConfirmarSenha(''),
            setSenhasCombinam(null)
    }

    useEffect(() => {
        buscarUsuarios();
    }, [])

    return (
        <>
            {/*  Modal Zone */}
            {/* modal de Novo usuario */}
            <Modal titulo="Cadastrar um novo usuário" isOpen={modalAtivo === 'novoUsuario'} onClose={() => limparModal()}>
                {sucessoModal ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                            Usuário cadastrado com sucesso!
                        </h3>
                        <p className="text-sm text-gray-600">
                            Fechando automaticamente...
                        </p>
                    </div>
                ) : (
                    <form className="space-y-3.5" autoComplete="off" onSubmit={(e) => { e.preventDefault(); cadastrarUsuario(); }}>
                        {/* Mensagem de Erro */}
                        {erroModal && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-red-800 mb-1">
                                        Erro ao cadastrar usuário
                                    </h4>
                                    <p className="text-sm text-red-600">{erroModal}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                Nome do Usuário
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                autoComplete="off"
                                onChange={(e) => setNovoUsuarioNome(e.target.value)}
                                disabled={carregandoModal}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                         placeholder:text-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="off"
                                onChange={(e) => setNovoUsuarioEmail(e.target.value)}
                                disabled={carregandoModal}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                         placeholder:text-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="johndoe@email.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={novoUsuarioSenha}
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setNovoUsuarioSenha(e.target.value);
                                    // Valida se já tem algo digitado no campo de confirmação
                                    if (confirmarSenha) {
                                        setSenhasCombinam(e.target.value === confirmarSenha);
                                    }
                                }}
                                disabled={carregandoModal}
                                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                         placeholder:text-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmarSenha}
                                    autoComplete="new-password"
                                    onChange={(e) => {
                                        setConfirmarSenha(e.target.value);
                                        // Valida em tempo real
                                        if (e.target.value.length > 0) {
                                            setSenhasCombinam(novoUsuarioSenha === e.target.value);
                                        } else {
                                            setSenhasCombinam(null);
                                        }
                                    }}
                                    disabled={carregandoModal}
                                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg 
                                             focus:outline-none focus:ring-2 focus:border-transparent
                                             placeholder:text-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed
                                             ${senhasCombinam === false ? 'border-red-500 focus:ring-red-500' :
                                            senhasCombinam === true ? 'border-green-500 focus:ring-green-500' :
                                                'border-gray-300 focus:ring-indigo-500'}`}
                                    placeholder="••••••••"
                                />
                                {/* Ícone de feedback */}
                                {senhasCombinam !== null && confirmarSenha.length > 0 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {senhasCombinam ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Mensagem de feedback */}
                            {senhasCombinam === false && confirmarSenha.length > 0 && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <XCircle className="w-4 h-4" />
                                    As senhas não coincidem
                                </p>
                            )}
                            {senhasCombinam === true && (
                                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                                    <CheckCircle className="w-4 h-4" />
                                    As senhas coincidem
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={carregandoModal || senhasCombinam === false || !novoUsuarioNome || !novoUsuarioEmail || !novoUsuarioSenha || !confirmarSenha}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                     focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg
                                     disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {carregandoModal ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Cadastrando...</span>
                                </>
                            ) : (
                                'Criar Conta'
                            )}
                        </button>
                    </form>
                )}
            </Modal>

            {/* Tela */}
            <div className="font-inter min-h-screen bg-[#F9FAFB]">
                {/* Banner */}
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
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm text-gray-600 mt-1">
                                    {carregandoUsuarios ? 'Carregando...' : `${usuarios.length} usuário(s) cadastrado(s)`}
                                </p>

                                <button onClick={() => { setModalAtivo('novoUsuario') }} className="bg-green-600 cursor-pointer p-2 rounded-2xl flex flex-row gap-2 text-white"><UserPlus />Novo Usuário</button>
                            </div>
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
                                                            onClick={() => alterarStatus(usuario._id, usuario.status)}
                                                            disabled={atualizandoStatus === usuario._id}
                                                            className="transition-transform hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title={usuario.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                                                        >
                                                            {atualizandoStatus === usuario._id ? (
                                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                                            ) : usuario.status === 'ativo' ? (
                                                                <ToggleRight className="text-green-600 w-5 h-5" />
                                                            ) : (
                                                                <ToggleLeft className="text-gray-400 w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            className="transition-transform hover:scale-110 cursor-pointer"
                                                            title="Excluir usuário"
                                                            onClick={() => { deletarUsuario(usuario._id) }}
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
        </>
    )
}