import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// CRUD Usuarios
app.get("/usuarios", async (req, res) => {
  const usuarios = await prisma.usuarios.findMany();
  res.json({
    success: true,
    payload: usuarios,
    message: "Operation Successful",
  });
});

app.get(`/usuario/:id`, async (req, res) => {
  const { id } = req.params;
  const usuario = await prisma.usuarios.findMany({
    where: {
      id: Number(id),
    },
  });
  res.json(usuario);
});

app.post("/crear_usuario", async (req, res) => {
  const result = await prisma.usuarios.create({
    data: req.body,
  });
  res.json(result);
});

app.delete(`/borrar_usuario/:id`, async (req, res) => {
  const { id } = req.params;
  const usuario = await prisma.usuarios.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(`El usuario con el id ${id} fue eliminada exitosamente`);
});

app.put("/editar_usuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const datosActualizados = await prisma.usuarios.update({
      where: { id: Number(id) },
      // req.body es la info que manda el usuario para actualizar
      data: req.body,
    });
    res.json({
      datos: datosActualizados,
      mensaje: `El usuario con el id ${id} fue actulizado exitosamente`,
    });
  } catch (e) {
    res.json({ error: `El usuario con el id ${id} no existe` });
  }
});

// CRUD Tweets
app.get(`/tweets/:autorId`, async (req, res) => {
  const { autorId } = req.params;
  const tweets = await prisma.tweets.findMany({
    where: {
      autorId: Number(autorId),
    },
  });
  res.json(tweets);
});

app.post("/crear_tweet", async (req, res) => {
  const result = await prisma.tweets.create({
    data: req.body,
  });
  res.json(result);
});

app.delete(`/borrar_tweet/:id`, async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweets.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(`El tweet con el id ${id} fue eliminada exitosamente`);
});

app.put("/editar_tweet/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const datosActualizados = await prisma.tweets.update({
      where: { id: Number(id) },
      // req.body es la info que manda el usuario para actualizar
      data: req.body,
    });
    res.json({
      datos: datosActualizados,
      mensaje: `El tweet con el id ${id} fue actulizado exitosamente`,
    });
  } catch (e) {
    res.json({ error: `El tweet con el id ${id} no existe` });
  }
});
// CRUD darle megusta a un tweet
app.get("/tweet_likes/:tweetId", async (req, res) => {
  const { tweetId } = req.params;
  const result = await prisma.likes.findMany({
    where: {
      tweetId: Number(tweetId),
    },
  });
  res.json({ likes: result.length });
});

// CRUD Likes
app.post("/crear_like", async (req, res) => {
  const result = await prisma.likes.create({
    data: req.body,
  });
  res.json(result);
});

app.delete(`/borrar_like/:usuarioId/:tweetId`, async (req, res) => {
  const { usuarioId, tweetId } = req.params;
  const tweet = await prisma.likes.deleteMany({
    where: {
      usuarioId: Number(usuarioId),
      tweetId: Number(tweetId),
    },
  });
  res.json(`El like al tweet con el id ${tweetId} fue eliminada exitosamente`);
});

// CRUD Comentarios asi el tweet
app.post("/crear_comentario", async (req, res) => {
  const result = await prisma.comentarios.create({
    data: req.body,
  });
  res.json(result);
});

app.delete(`/borrar_comentario/:tweetId/:usuarioId`, async (req, res) => {
  const { comentario, foto, usuarioId, tweetId } = req.params;
  const tweet = await prisma.comentarios.deleteMany({
    where: {
      comentario: String(comentario),
      foto: String(foto),
      tweetId: Number(tweetId),
      usuarioId: Number(usuarioId),
    },
  });
  res.json(
    `El comentario al tweet con el id ${tweetId} fue eliminada exitosamente`
  );
});
// CRUD darle megusta a un tweet
app.get("/comentario_tweet/:tweetId", async (req, res) => {
  const { tweetId } = req.params;
  const result = await prisma.comentarios.findMany({
    where: {
      tweetId: Number(tweetId),
    },
  });
  res.json({ comentario: result.length });
});

// CRUD Follws usuarios
app.post("/crear_follws", async (req, res) => {
  const result = await prisma.follows.create({
    data: req.body,
  });
  res.json(result);
});

app.delete(`/borrar_follws/:usuarioId/:usuarioSeguirId`, async (req, res) => {
  const { usuarioId, usuarioSeguirId } = req.params;
  const tweet = await prisma.follows.deleteMany({
    where: {
      usuarioId: Number(usuarioId),
      usuarioSeguirId: Number(usuarioSeguirId),
    },
  });
  res.json(`Ya no siges al usuario ${usuarioId} piensalo`);
});

app.use((req, res, next) => {
  res.status(404);
  return res.json({
    success: false,
    payload: null,
    message: `API SAYS: Endpoint not found for path: ${req.path}`,
  });
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`???? Example app listening on port 8000`)
);
