import { logger } from '@shared/logger';
import { Config } from '@shared/config';
import { isEnvBrowser } from './misc';

export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mock?: { data: T; delay?: number }
): Promise<T> {
  if (isEnvBrowser()) {
    logger.debug(`fetchNui called {eventName} in browser environment`, data as string);
    if (!mock) return await new Promise((resolve) => resolve({} as T));
    await new Promise((res) => setTimeout(res, mock.delay || 0));
    return mock.data;
  }

  logger.info(`Sending to client NUI event: ${eventName}`, data as string);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data || {}),
  };

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : Config.MODULE_NAME;

  try {
    const response = await fetch(`https://${resourceName}/${eventName}`, options);
    const result = await response.json();
    logger.info(`Received response from NUI event: ${eventName}`, result as string);
    return result as T;
  } catch (error) {
    logger.error(`Error fetching NUI event: ${eventName}`, error as string);
    throw error;
  }
}
