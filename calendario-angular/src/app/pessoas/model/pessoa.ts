import { Assessoria } from "../../assessorias/model/assessoria";

export interface Pessoa {

	_id: string;

	identidade: string;

	users: string;

	tipoAcesso: string;

	nome: string;

	nomeGuerra: string;

	postoGraduacao: string;
    //caio adição
	armaquadroservico?: string;

	antiguidade: number;

	assessoria: Assessoria;

	liberado: string;

	ramal: string;

	caminho: string

	// Novas informações para TI
	controleAcessoId?: string;
	contaAd?: string;
	contaSiscau?: string;
	contaSped?: string;

}
