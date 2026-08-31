# FlashLearn AI

**FlashLearn AI** es una aplicación de flashcards para estudio potenciada por IA:

- Sube tus apuntes y deja que la IA extraiga los conceptos clave y genere un mazo de tarjetas de estudio.
- Pide explicaciones más detalladas cuando algo no te quede claro o te cueste recordarlo.
- Ponte a prueba con cuestionarios generados automáticamente a partir de tus tarjetas de estudio.

Proyecto personal full-stack construido para crecer en el ámbito del desarrollo web y aprender a trabajar con tecnologías como Next.js, Supabase y Google Gemini API en un entorno de producción realista, con control de versiones y CI/CD.

Puedes visitar la app haciendo click [aquí](https://flashlearn-ai-phi.vercel.app/) o copiando este enlace en tu navegador: https://flashlearn-ai-phi.vercel.app/

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Aprendizajes](#aprendizajes)
- [Decisiones técnicas](#decisiones-técnicas)
- [Roadmap](#roadmap)

---

## Funcionalidades

### 📄 Generación de mazos desde archivos

Sube uno o varios archivos de apuntes (PDF, TXT o MD) y la IA analiza su contenido para generar automáticamente un mazo de tarjetas de pregunta/respuesta, cubriendo los conceptos clave del material. La aplicación guarda un breve resumen del nivel y enfoque del contenido original para adaptar las explicaciones que necesites generar más adelante.

### 🧠 Tutor IA

Cuando una tarjeta no te quede clara, puedes pedir una explicación más detallada: la IA genera ejemplos y analogías adicionales, manteniendo el mismo nivel y enfoque que el material original. Las explicaciones se guardan para que puedas consultarlas de forma rápida siempre que quieras.

### ✅ Cuestionarios tipo test

A partir de las tarjetas de un mazo puedes generar preguntas de opción múltiple. Cada vez que intentes resolver el cuestionario, se selecciona un subconjunto aleatorio de tarjetas, y se baraja tanto el orden de las preguntas como el de las opciones de respuesta. Los resultados actualizan estadísticas de aciertos/fallos en cada tarjeta.

---

## Stack tecnológico

| Área          | Tecnología                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | Next.js (App JavaScript)                                    |
| Frontend      | React, Tailwind CSS                                         |
| Backend       | JavaScript (Server Actions), Supabase                       |
| Base de datos | Supabase (Postgres, Auth, Row Level Security)               |
| IA            | Vercel AI SDK + Google Gemini API (`gemini-3.5-flash-lite`) |
| Despliegue    | Vercel                                                      |
| CI/CD         | GitHub Actions                                              |

---

## Estructura del proyecto

```
flashlearnai/
├── src/
│   ├── app/
│   |   ├── (auth)/                  # Login y registro
│   |   |   ├── login/
│   |   |   |   └── page.jsx
│   |   |   ├── signup/
│   |   |   |   └── page.jsx
│   |   |   └── layout.jsx
│   |   |
│   |   ├── (dashboard)/             # Funcionalidades de la app
│   |   |   ├── dashboard/
│   |   |   |   └── page.jsx
│   |   |   ├── decks/
|   │   |   |   ├── new/
│   |   |   |   |   └── page.jsx
│   |   |   |   └── [id]/
│   |   |   |       ├── page.jsx
│   |   |   |       └── quiz/
|   │   |   |           └── page.jsx
│   |   |   └── layout.jsx
│   |   |
│   |   ├── actions/                 # Server actions
│   |   |
│   |   ├── api/
│   |   |   └── auth/                # Confirmación de email
│   |   |       └── route.js
│   |   |
│   |   ├── favicon.ico
│   |   ├── globals.css
│   |   ├── page.jsx
│   |   └── layout.jsx
|   |
│   ├── components/                  # Componentes UI reutilizables
│   |   └── icons/
│   |
│   ├── lib/
│   |   ├── ai/                      # Esquema zod respuestas IA
│   |   ├── supabase/                # Clientes de Supabase
│   |   └── utils/                   # Funciones auxiliares
│   |
│   └── tests/                       # Pruebas Jest
|
├── supabase/
│   └── migrations/                  # Migraciones base de datos
|
├── .env.local                       # Variables de entorno
├── middleware.js                    # Protección de rutas privadas
└── types.d.ts                       # Tipos de Supabase
```

---

## Aprendizajes

- **Desarrollo de aplicaciones web con Next.js y principales características del framework:** componentes React renderizados en el servidor, enrutamiento basado en archivos, ejecución de código backend con Server Actions.
- **Aplicación de estilos de UI mediante TailwindCSS:** clases CSS inline y animaciones.
- **Diseño y gestión de bases de datos PostgreSQL con Supabase:** protección de tablas con RLS, creación de índices para acelerar consultas, uso de triggers y RPC's.
- **Integración de funcionalidades de IA:** esquemas de validación con Zod, consultas a modelos de IA mediante API's, prevención de errores causados por alucinaciones del modelo.
- **Uso de herramientas de gestión de proyectos:** control de versiones en Github con ramas de producción y desarrollo, workflows de CI/CD con Github Actions, despliegue automatizado en Vercel.

---

## Decisiones técnicas

- **Contexto de los archivos de apuntes guardado en base de datos** para generar explicaciones de conceptos con un nivel y enfoque coherentes.
- **Caché de explicaciones y preguntas de test en base de datos** para acceder de forma rápida y ahorrar consumo de cuota de IA
- **Generación de IA solo bajo acción explícita del usuario**, nunca al cargar una página. El prefetching de enlaces de Next.js, los crawlers y las peticiones repetidas no disparan generaciones y consumos de cuota no deseados.
- **Protección contra race conditions** mediante constraints UNIQUE en base de datos y operaciones `upsert` con `ignoreDuplicates` para no bloquear la peticiones.
- **Barajado de cuestionarios en Server Component**, en lugar de en el cliente: usar `Math.random()` dentro de un `useState` de un Client Component provoca discrepancias de hidratación entre servidor y navegador.
- **Actualización de estadísticas vía función RPC de Postgres**, para que los incrementos de aciertos/fallos de varias tarjetas se apliquen de forma atómica en una sola transacción.

---

## Roadmap

- Generación de trajetas de estudio a partir de imágenes.
- Estadísticas de estudio en UI (tasa de aciertos en cuestionarios, tiempo desde la última sesión de estudio, etc.)
- Tests con Playwright para validar los flujos de negocio.
