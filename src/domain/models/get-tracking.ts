export interface TrackProps {
    carrier: string
    tracking_code: string
    correios_object: CorreiosObject
}

export interface CorreiosObject {
    codObjeto: string
    tipoPostal: TipoPostal
    dtPrevista: string
    modalidade: string
    eventos: Evento[]
    situacao: string
    autoDeclaracao: boolean
    encargoImportacao: boolean
    percorridaCarteiro: boolean
    bloqueioObjeto: boolean
    arEletronico: boolean
    arImagem: any
    locker: boolean
    atrasado: boolean
    urlFaleComOsCorreios: string
    temEventoEntrega: boolean
    permiteVisualziarArEletronico: any
}

export interface TipoPostal {
    sigla: string
    descricao: string
    categoria: string
    tipo: string
}

export interface Evento {
    codigo: string
    tipo: string
    dtHrCriado: DtHrCriado
    descricao: string
    unidade: Unidade
    unidadeDestino?: UnidadeDestino
    comentario: string
    icone: string
    descricaoFrontEnd: string
    finalizador: string
    rota: string
    descricaoWeb: string
    detalhe: string
    destinatario: any
    cached: boolean
}

export interface DtHrCriado {
    date: string
    timezone_type: number
    timezone: string
}

export interface Unidade {
    nome: string
    codSro: string
    codMcu: string
    tipo: string
    endereco: Endereco
}

export interface Endereco {
    identificacao: any
    principal: any
    numero: any
    logradouro: any
    complemento: any
    bairro: any
    cidade?: string
    uf?: string
    codigoPostal: any
    siglaPais: any
}

export interface UnidadeDestino {
    nome: string
    codSro: string
    codMcu: string
    tipo: string
    endereco: Endereco2
}

export interface Endereco2 {
    identificacao: any
    principal: any
    numero: any
    logradouro: any
    complemento: any
    bairro: any
    cidade: string
    uf: string
    codigoPostal: any
    siglaPais: any
}
