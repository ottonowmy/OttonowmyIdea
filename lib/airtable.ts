import Airtable from 'airtable';

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export const base = airtable.base(process.env.AIRTABLE_BASE_ID || '');

export const tables = {
  users: base('Users'),
  ideas: base('Ideas'),
  comments: base('Comments'),
  votes: base('Votes'),
};

// Récupérer un utilisateur par clerkId
export const getUser = async (clerkId: string) => {
  const records = await tables.users
    .select({ filterByFormula: `{clerkId} = '${clerkId}'` })
    .firstPage();
  return records[0];
};

// Créer un utilisateur
export const createUser = async (data: any) => {
  const record = await tables.users.create(data);
  return record;
};

// Récupérer toutes les idées publiques
export const getPublicIdeas = async () => {
  const records = await tables.ideas
    .select({ filterByFormula: "{visibility} = 'Public'" })
    .all();
  return records;
};

// Récupérer les idées d'un utilisateur (publiques + privées)
export const getUserIdeas = async (userId: string) => {
  const records = await tables.ideas
    .select({ filterByFormula: `{createdBy} = '${userId}'` })
    .all();
  return records;
};

// Récupérer une idée par ID
export const getIdea = async (ideaId: string) => {
  const record = await tables.ideas.find(ideaId);
  return record;
};

// Créer une idée
export const createIdea = async (data: any) => {
  const record = await tables.ideas.create(data);
  return record;
};

// Ajouter un commentaire
export const createComment = async (data: any) => {
  const record = await tables.comments.create(data);
  return record;
};

// Récupérer les commentaires d'une idée
export const getIdeaComments = async (ideaId: string) => {
  const records = await tables.comments
    .select({ filterByFormula: `{ideaId} = '${ideaId}'` })
    .all();
  return records;
};

// Voter sur une idée
export const createVote = async (data: any) => {
  const record = await tables.votes.create(data);
  return record;
};

// Mettre à jour les likes/dislikes d'une idée
export const updateIdeaVotes = async (ideaId: string, likes: number, dislikes: number) => {
  const record = await tables.ideas.update(ideaId, {
    likes,
    dislikes,
  });
  return record;
};

// Mettre à jour les éclairs d'un utilisateur
export const updateUserEclairs = async (userId: string, eclairs: number) => {
  const record = await tables.users.update(userId, { eclairs });
  return record;
};
