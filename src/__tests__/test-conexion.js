import { createClient } from "@/lib/supabase/server";

// Mapeo/Mock de next/headers para evitar que cookies() falle fuera del contexto de una petición HTTP en Jest
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  }),
}));

describe("Test de conexión con Supabase", () => {
  it("debe conectar correctamente a la base de datos sin retornar errores", async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("decks").select("id").limit(1);

    // Se verifica que no exista error en la comunicación con la base de datos
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
