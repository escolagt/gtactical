export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: 'Qual a idade mínima para participar dos cursos?',
    answer: 'De acordo com a legislação brasileira, a idade mínima para participar de cursos de tiro é 18 anos completos. É necessário apresentar documento de identificação com foto no momento da inscrição.',
  },
  {
    question: 'O que devo trazer para o curso?',
    answer: 'Recomendamos roupas confortáveis (calça comprida e camisa), calçado fechado, protetor auricular próprio (se tiver), e garrafa de água. Todo o equipamento de segurança obrigatório (EPI) será fornecido pela escola.',
  },
  {
    question: 'Qual a política de cancelamento e troca de turma?',
    answer: 'Cancelamentos realizados com até 7 dias de antecedência têm reembolso de 100%. Entre 3 e 7 dias: 50% de reembolso. Menos de 3 dias: sem reembolso. Trocas de turma podem ser realizadas sem custo adicional com até 48h de antecedência, sujeito a disponibilidade.',
  },
  {
    question: 'Há algum requisito de saúde?',
    answer: 'É necessário estar em condições físicas adequadas para participar das atividades. Pessoas com problemas cardíacos, auditivos não tratados, ou outras condições que possam ser agravadas pela atividade devem consultar um médico antes de participar.',
  },
  {
    question: 'Quais são os equipamentos de segurança utilizados?',
    answer: 'Todos os participantes devem utilizar: proteção auricular dupla (abafador + plug), óculos de proteção balísticos, e seguir rigorosamente as regras de segurança do estande. A G-TACTICAL fornece todos os EPIs necessários.',
  },
  {
    question: 'Preciso ter experiência prévia?',
    answer: 'Não! Nossos cursos atendem desde iniciantes até atiradores avançados. Cada programa é estruturado para o nível de conhecimento do participante, com instrutores experientes acompanhando individualmente.',
  },
];
