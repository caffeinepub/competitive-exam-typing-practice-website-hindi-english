import { type Session } from '../backend';

let cachedActor: any = null;

async function getActor() {
  if (cachedActor) return cachedActor;
  
  const { createActorWithConfig } = await import('../config');
  cachedActor = await createActorWithConfig();
  return cachedActor;
}

export async function recordSession(session: Session): Promise<bigint> {
  try {
    const actor = await getActor();
    const id = await actor.recordSession(session);
    return id;
  } catch (error) {
    console.error('Failed to record session:', error);
    throw error;
  }
}
