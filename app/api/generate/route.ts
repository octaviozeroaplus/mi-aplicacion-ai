import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Obtiene el cuerpo de la solicitud (historial de mensajes)
    const { messages } = await request.json();

    console.log('Historial de mensajes recibido:', messages); // Log para verificar el historial

    // Llama a la API de OpenAI usando el modelo gpt-3.5-turbo
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', // Endpoint para chat completions
      {
        model: 'gpt-3.5-turbo', // Modelo actualizado
        messages: messages, // Historial de mensajes (incluye mensajes del usuario y del asistente)
        max_tokens: 100, // Máximo número de palabras en la respuesta
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

    // Devuelve SOLO la respuesta del asistente
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    // Manejo seguro del error
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const typedError = error as { response?: { data: unknown } };
      errorMessage = typedError.response?.data as string || errorMessage;
    }

    console.error('Error al llamar a OpenAI:', errorMessage); // Log para capturar errores
    return new Response(JSON.stringify({ error: 'Error al generar la respuesta' }), { status: 500 });
  }
}