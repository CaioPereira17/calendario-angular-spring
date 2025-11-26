
// export enum PostoGraduacao {
//   GEN_EXERCITO,
// 	GEN_DIVISAO,
// 	GEN_BRIGADA,
// 	CORONEL,
// 	TEN_CORONEL,
// 	MAJOR,
// 	CAPITAO,
// 	PRI_TENENTE,
// 	SEG_TENENTE,
// 	ASP,
// 	SUBTENENTE,
// 	PRI_SARGENTO,
// 	SEG_SARGENTO,
// 	TER_SARGENTO,
// 	CABO,
// 	SOLDADO,
// 	FUNC_CIV
// }
// export const PostoGraduacaoList = [
//   { value: PostoGraduacao.GEN_EXERCITO, viewValue: 'Gen Ex' , imageUrl: 'assets/images/gen_ex.png' },
//   { value: PostoGraduacao.GEN_DIVISAO, viewValue: 'Gen Div', imageUrl: 'assets/images/gen_div.png' },
//   { value: PostoGraduacao.GEN_BRIGADA, viewValue: 'Gen Bda', imageUrl: 'assets/images/gen_bda.png' },
//   { value: PostoGraduacao.CORONEL, viewValue: 'Cel', imageUrl: 'assets/images/cel.png' },
//   { value: PostoGraduacao.TEN_CORONEL, viewValue: 'Ten Cel', imageUrl: 'assets/images/ten_cel.png' },
//   { value: PostoGraduacao.MAJOR, viewValue: 'Maj', imageUrl: 'assets/images/maj.png'  },
//   { value: PostoGraduacao.CAPITAO, viewValue: 'Cap', imageUrl: 'assets/images/cap.png' },
//   { value: PostoGraduacao.PRI_TENENTE, viewValue: '1º Ten', imageUrl: 'assets/images/1_ten.png' },
//   { value: PostoGraduacao.SEG_TENENTE, viewValue: '2º Ten', imageUrl: 'assets/images/2_ten.png' },
//   { value: PostoGraduacao.ASP, viewValue: 'Asp', imageUrl: 'assets/images/asp.png' },
//   { value: PostoGraduacao.SUBTENENTE, viewValue: 'ST', imageUrl: 'assets/images/st.png' },
//   { value: PostoGraduacao.PRI_SARGENTO, viewValue: '1º SGT', imageUrl: 'assets/images/1_sgt.png' },
//   { value: PostoGraduacao.SEG_SARGENTO, viewValue: '2º SGT', imageUrl: 'assets/images/2_sgt.png'  },
//   { value: PostoGraduacao.TER_SARGENTO, viewValue: '3º SGT', imageUrl: 'assets/images/3_sgt.png' },
//   { value: PostoGraduacao.CABO, viewValue: 'Cabo', imageUrl: 'assets/images/cabo.png'},
//   { value: PostoGraduacao.SOLDADO, viewValue: 'Soldado', imageUrl: 'assets/images/soldado.png' },
//   { value: PostoGraduacao.FUNC_CIV, viewValue: 'Funcionário Civíl', imageUrl: 'assets/images/func_civ.png' },
// ];

// const postos = Object.values(PostoGraduacao);

// Caio adição de militares da reserva.
export enum PostoGraduacao {
  GEN_EXERCITO,
  GEN_DIVISAO,
  GEN_DIVISAO_R1, // Novo
  GEN_BRIGADA,
  GEN_BRIGADA_R1, // Novo
  CORONEL,
  CORONEL_R1,     // Novo
  TEN_CORONEL,
  TEN_CORONEL_R1, // Novo
  MAJOR,
  MAJOR_R1,       // Novo
  CAPITAO,
  CAPITAO_R1,     // Novo
  PRI_TENENTE,
  PRI_TENENTE_R1, // Novo
  SEG_TENENTE,
  SEG_TENENTE_R1, // Novo
  ASP,
  ASP_R1,         // Novo
  SUBTENENTE,
  SUBTENENTE_R1,  // Novo
  PRI_SARGENTO,
  PRI_SARGENTO_R1,// Novo
  SEG_SARGENTO,
  SEG_SARGENTO_R1,// Novo
  TER_SARGENTO,
  TER_SARGENTO_R1,// Novo
  CABO,
  SOLDADO,
  FUNC_CIV
}

export const PostoGraduacaoList = [
  // Oficiais Generais
  { value: PostoGraduacao.GEN_EXERCITO, viewValue: 'Gen Ex', imageUrl: 'assets/images/gen_ex.png' },
  
  { value: PostoGraduacao.GEN_DIVISAO, viewValue: 'Gen Div', imageUrl: 'assets/images/gen_div.png' },
  { value: PostoGraduacao.GEN_DIVISAO_R1, viewValue: 'Gen Div R1', imageUrl: 'assets/images/gen_div.png' }, // R1

  { value: PostoGraduacao.GEN_BRIGADA, viewValue: 'Gen Bda', imageUrl: 'assets/images/gen_bda.png' },
  { value: PostoGraduacao.GEN_BRIGADA_R1, viewValue: 'Gen Bda R1', imageUrl: 'assets/images/gen_bda.png' }, // R1

  // Oficiais Superiores
  { value: PostoGraduacao.CORONEL, viewValue: 'Cel', imageUrl: 'assets/images/cel.png' },
  { value: PostoGraduacao.CORONEL_R1, viewValue: 'Cel R1', imageUrl: 'assets/images/cel.png' }, // R1

  { value: PostoGraduacao.TEN_CORONEL, viewValue: 'Ten Cel', imageUrl: 'assets/images/ten_cel.png' },
  { value: PostoGraduacao.TEN_CORONEL_R1, viewValue: 'Ten Cel R1', imageUrl: 'assets/images/ten_cel.png' }, // R1

  { value: PostoGraduacao.MAJOR, viewValue: 'Maj', imageUrl: 'assets/images/maj.png' },
  { value: PostoGraduacao.MAJOR_R1, viewValue: 'Maj R1', imageUrl: 'assets/images/maj.png' }, // R1

  // Oficiais Intermediários
  { value: PostoGraduacao.CAPITAO, viewValue: 'Cap', imageUrl: 'assets/images/cap.png' },
  { value: PostoGraduacao.CAPITAO_R1, viewValue: 'Cap R1', imageUrl: 'assets/images/cap.png' }, // R1

  // Oficiais Subalternos
  { value: PostoGraduacao.PRI_TENENTE, viewValue: '1º Ten', imageUrl: 'assets/images/1_ten.png' },
  { value: PostoGraduacao.PRI_TENENTE_R1, viewValue: '1º Ten R1', imageUrl: 'assets/images/1_ten.png' }, // R1

  { value: PostoGraduacao.SEG_TENENTE, viewValue: '2º Ten', imageUrl: 'assets/images/2_ten.png' },
  { value: PostoGraduacao.SEG_TENENTE_R1, viewValue: '2º Ten R1', imageUrl: 'assets/images/2_ten.png' }, // R1

  { value: PostoGraduacao.ASP, viewValue: 'Asp', imageUrl: 'assets/images/asp.png' },
  { value: PostoGraduacao.ASP_R1, viewValue: 'Asp R1', imageUrl: 'assets/images/asp.png' }, // R1

  // Praças
  { value: PostoGraduacao.SUBTENENTE, viewValue: 'ST', imageUrl: 'assets/images/st.png' },
  { value: PostoGraduacao.SUBTENENTE_R1, viewValue: 'ST R1', imageUrl: 'assets/images/st.png' }, // R1

  { value: PostoGraduacao.PRI_SARGENTO, viewValue: '1º SGT', imageUrl: 'assets/images/1_sgt.png' },
  { value: PostoGraduacao.PRI_SARGENTO_R1, viewValue: '1º SGT R1', imageUrl: 'assets/images/1_sgt.png' }, // R1

  { value: PostoGraduacao.SEG_SARGENTO, viewValue: '2º SGT', imageUrl: 'assets/images/2_sgt.png' },
  { value: PostoGraduacao.SEG_SARGENTO_R1, viewValue: '2º SGT R1', imageUrl: 'assets/images/2_sgt.png' }, // R1

  { value: PostoGraduacao.TER_SARGENTO, viewValue: '3º SGT', imageUrl: 'assets/images/3_sgt.png' },
  { value: PostoGraduacao.TER_SARGENTO_R1, viewValue: '3º SGT R1', imageUrl: 'assets/images/3_sgt.png' }, // R1

  { value: PostoGraduacao.CABO, viewValue: 'Cabo', imageUrl: 'assets/images/cabo.png' },
  { value: PostoGraduacao.SOLDADO, viewValue: 'Soldado', imageUrl: 'assets/images/soldado.png' },
  { value: PostoGraduacao.FUNC_CIV, viewValue: 'Funcionário Civil', imageUrl: 'assets/images/func_civ.png' },
];

// Apenas para manter compatibilidade se você usar 'postos' em algum lugar
export const postos = Object.values(PostoGraduacao);