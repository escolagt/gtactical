/**
 * Google Apps Script para processar inscrições da G-TACTICAL
 * 
 * SETUP:
 * 1. Criar novo projeto em script.google.com
 * 2. Colar este código
 * 3. Criar planilha "Leads G-TACTICAL" (ou deixar o script criar automaticamente)
 * 4. Deploy como Web App com acesso "Qualquer pessoa"
 * 5. Copiar URL do Web App e colar em src/lib/constants.ts
 * 6. Substituir NOTIFY_EMAIL abaixo com seu email real
 */

const SHEET_NAME = 'Leads G-TACTICAL';
const NOTIFY_EMAIL = 'contato@g-tactical.com'; // TODO: Substituir com email real

function doPost(e) {
  try {
    // Parse JSON payload
    const data = JSON.parse(e.postData.contents);
    
    // Sanitize inputs
    const sanitizedData = {
      timestamp: data.timestamp || new Date().toISOString(),
      curso: sanitizeString(data.curso),
      turma: sanitizeString(data.turma),
      nome: sanitizeString(data.nome),
      dataNascimento: data.dataNascimento,
      cpf: sanitizeCPF(data.cpf),
      telefone: sanitizePhone(data.telefone),
      email: sanitizeEmail(data.email),
      cidade: sanitizeString(data.cidade),
      uf: sanitizeString(data.uf).toUpperCase(),
      observacoes: sanitizeString(data.observacoes || ''),
      aceitoTermos: !!data.aceitoTermos,
      aceitoGravacao: !!data.aceitoGravacao
    };
    
    // Validate required fields
    if (!sanitizedData.nome || !sanitizedData.email || !sanitizedData.telefone) {
      return createResponse(false, 'Campos obrigatórios não preenchidos');
    }
    
    // Get or create spreadsheet
    const sheet = getOrCreateSheet();
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Curso',
        'Turma',
        'Nome',
        'Data Nascimento',
        'CPF',
        'Telefone',
        'Email',
        'Cidade',
        'UF',
        'Observações',
        'Aceito Termos',
        'Aceito Gravação'
      ]);
    }
    
    // Append data
    sheet.appendRow([
      sanitizedData.timestamp,
      sanitizedData.curso,
      sanitizedData.turma,
      sanitizedData.nome,
      sanitizedData.dataNascimento,
      sanitizedData.cpf,
      sanitizedData.telefone,
      sanitizedData.email,
      sanitizedData.cidade,
      sanitizedData.uf,
      sanitizedData.observacoes,
      sanitizedData.aceitoTermos ? 'Sim' : 'Não',
      sanitizedData.aceitoGravacao ? 'Sim' : 'Não'
    ]);
    
    // Send notification email
    sendNotificationEmail(sanitizedData);
    
    return createResponse(true, 'Inscrição registrada com sucesso');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createResponse(false, 'Erro ao processar inscrição: ' + error.toString());
  }
}

function getOrCreateSheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    // Create new spreadsheet if it doesn't exist
    ss = SpreadsheetApp.create(SHEET_NAME);
  }
  
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  return sheet;
}

function sendNotificationEmail(data) {
  const subject = `Nova Inscrição - ${data.curso}`;
  
  const body = `
Nova inscrição recebida na G-TACTICAL:

CURSO: ${data.curso}
TURMA: ${data.turma}

DADOS DO ALUNO:
Nome: ${data.nome}
Data de Nascimento: ${data.dataNascimento}
CPF: ${data.cpf}
Telefone/WhatsApp: ${data.telefone}
Email: ${data.email}
Cidade/UF: ${data.cidade}/${data.uf}

OBSERVAÇÕES:
${data.observacoes || 'Nenhuma'}

CONSENTIMENTOS:
Aceito Termos: ${data.aceitoTermos ? 'Sim' : 'Não'}
Aceito Gravação: ${data.aceitoGravacao ? 'Sim' : 'Não'}

Data/Hora: ${data.timestamp}

---
G-TACTICAL Sistema de Inscrições
  `;
  
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body
    });
  } catch (error) {
    Logger.log('Email notification failed: ' + error.toString());
  }
}

function createResponse(ok, message) {
  const response = {
    ok: ok,
    message: message
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

function doGet(e) {
  return createResponse(true, 'G-TACTICAL API está funcionando');
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// Sanitization functions
function sanitizeString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/[<>]/g, '');
}

function sanitizeCPF(cpf) {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
}

function sanitizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

function sanitizeEmail(email) {
  if (!email) return '';
  return email.toString().trim().toLowerCase();
}
