// Vercel Serverless Function — integração Brevo segura (site previdenciário)
// A chave fica APENAS aqui, como variável de ambiente do servidor.
// O navegador do visitante nunca vê a chave.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email } = req.body || {};

  if (!email || !nome) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuração de servidor incompleta' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        attributes: { FIRSTNAME: nome, AREA: 'previdenciario' },
        listIds: [2],
        updateEnabled: true,
      }),
    });

    if (!response.ok && response.status !== 204) {
      const err = await response.text();
      return res.status(response.status).json({ error: 'Falha no Brevo', detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', detail: String(err) });
  }
}
