import { Language, type Passage } from '../backend';
import { useActor } from '../hooks/useActor';

let cachedActor: any = null;

async function getActor() {
  if (cachedActor) return cachedActor;
  
  // Import dynamically to avoid circular dependencies
  const { createActorWithConfig } = await import('../config');
  cachedActor = await createActorWithConfig();
  return cachedActor;
}

export async function getPassagesByLanguage(language: Language): Promise<Passage[]> {
  try {
    const actor = await getActor();
    const passages = await actor.getPassagesByLanguage(language);
    return passages;
  } catch (error) {
    console.error('Failed to fetch passages:', error);
    throw error;
  }
}
