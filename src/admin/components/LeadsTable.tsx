import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const LeadsTable = () => {
  // Mock data for MVP
  const mockLeads = [
    { id: 1, nome: 'João Silva', curso: 'Defesa Residencial', turma: '2025-12-15', whatsapp: '(42) 99999-1234', data: '2025-11-01' },
    { id: 2, nome: 'Maria Santos', curso: 'Fundamentos de Tiro', turma: '2025-12-22', whatsapp: '(42) 99999-5678', data: '2025-11-02' },
    { id: 3, nome: 'Pedro Costa', curso: 'Tático Avançado', turma: '2026-01-10', whatsapp: '(42) 99999-9012', data: '2025-11-03' },
    { id: 4, nome: 'Ana Oliveira', curso: 'Defesa Residencial', turma: '2025-12-15', whatsapp: '(42) 99999-3456', data: '2025-11-04' },
    { id: 5, nome: 'Carlos Ferreira', curso: 'Fundamentos de Tiro', turma: '2025-12-22', whatsapp: '(42) 99999-7890', data: '2025-11-05' },
  ];

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Data/Turma</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Data de envio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.nome}</TableCell>
              <TableCell>{lead.curso}</TableCell>
              <TableCell>{new Date(lead.turma).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{lead.whatsapp}</TableCell>
              <TableCell>{new Date(lead.data).toLocaleDateString('pt-BR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
