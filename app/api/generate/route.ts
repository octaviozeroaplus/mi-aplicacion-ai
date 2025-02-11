import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Obtiene el cuerpo de la solicitud (el tema o pregunta del usuario)
    const { prompt } = await request.json();

    console.log('Prompt recibido:', prompt); // Log para verificar el prompt

    // Llama a la API de OpenAI usando el modelo gpt-3.5-turbo
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', // Endpoint para chat completions
      {
        model: 'gpt-3.5-turbo', // Modelo actualizado
        messages: [{ role: 'user', content: prompt }], // Formato requerido por el modelo
        max_tokens: 50, // Máximo número de palabras en la respuesta
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Usa la clave API desde .env.local
        },
      }
    );

    console.log('Respuesta de OpenAI:', response.data); // Log para verificar la respuesta

    // Extrae la respuesta generada por la IA
    const result = response.data.choices[0].message.content.trim();
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    // Verifica si el error es un objeto con las propiedades esperadas
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      errorMessage = (error as any).response?.data || errorMessage;
    }

    console.error('Error al llamar a OpenAI:', errorMessage); // Log para capturar errores
    return new Response(JSON.stringify({ error: 'Error al generar la respuesta' }), { status: 500 });
  }
}